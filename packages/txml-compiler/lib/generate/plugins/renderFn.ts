import {
  ArithmeticExpr,
  ConstantExpr,
  ElementNode,
  NodeTypes,
  VariableExpr,
  ArithmeticOpTypes,
  Expr,
  ConditionExpr,
  ConditionOpTypes,
  OneArgExpr,
  OneArgOpTypes,
  TenaryExpr,
  ObjectAccessExpr,
  ArrayExpr,
  ObjectExpr,
  AttributeNode,
  DirectiveNode,
  RootNode,
  ForNode,
  Node,
  BlockNode,
  IfNode,
  IfBranchNode,
  InterpolationNode,
  SlotNode,
} from "../../parser/ast";
import { visit } from "../visitor";
import { createRootPath, NodePath } from "../context";

export type R<T> = T & {
  code: string;
};

function snakeToCamel(value: string): string {
  return value
    .split("-")
    .map((a) => {
      if (a.length === 0) return "";
      return `${a[0].toUpperCase()}${a.slice(1)}`;
    })
    .join("");
}

function convertAttributeName(value: string): string {
  if (value === "class") {
    return "className";
  }

  return value;
}

function isCustomComponent(tag: string): boolean {
  return !["view", "button"].includes(tag);
}

// TODO
// bug if tiki:if directive use variable with
// same name is tiki:for-if or tiki:for-item
// <view tiki:for="{{item}}" tiki:for-item="item" />
function isPredefinedVariable(name: string, paths: NodePath): boolean {
  const node = paths.node as R<typeof paths.node>;
  if (node.type === NodeTypes.FOR) {
    if (node.itemName === name || node.indexName === name) {
      return true;
    }
  }
  if (paths.parent === undefined) return false;
  return isPredefinedVariable(name, paths.parent);
}

export default function plugin(root: RootNode): void {
  const visitor = {
    RootNode: {
      exit(paths: NodePath) {
        const root = paths.node as R<RootNode>;
        const childrenCode = root.children
          .map((item) => (item as R<ElementNode>).code)
          .join("\n");
        const useFragment =
          root.children.length > 1 ||
          root.children.filter((child) =>
            [NodeTypes.IF, NodeTypes.FOR].includes(child.type)
          ).length > 0;
        if (!useFragment) {
          root.code = `
function render(data) {
  return (${childrenCode});
}`;
        } else {
          root.code = `
function render(data) {
  return <>${childrenCode}</>;
}`;
        }
      },
    },

    ForNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<ForNode>;
        const { itemName: item, indexName: index } = node;
        node.code = `
        {
          ${(node.data as R<Expr>).code}.map((${item}, ${index}) => {
            return ${(node.content as R<Node>).code};
          })
        }
        `;
      },
    },

    IfNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<IfNode>;
        const hasElseCondition =
          node.branches.filter((branch) => branch.condition === undefined)
            .length > 0;
        node.code = `${node.branches
          .map((child) => (child as R<Node>).code)
          .join(": \n")}`;
        if (!hasElseCondition) {
          node.code += " : null";
        }
        node.code = `{ ${node.code} }`;
      },
    },

    IfBranchNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<IfBranchNode>;
        const content = (node.content as R<Node>).code;
        if (node.condition) {
          const condition = (node.condition as R<Expr>).code;
          node.code = `${condition} ? ${content} `;
        } else {
          node.code = content;
        }
      },
    },

    BlockNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<BlockNode>;
        node.code = `
          <>
          ${node.children.map((item) => (item as R<Node>).code).join("\n")}
          </>
        `;
      },
    },

    ImportNode: {
      exit(paths: NodePath) {},
    },

    IncludeNode: {
      exit(paths: NodePath) {},
    },

    ImportSjsNode: {
      exit(paths: NodePath) {},
    },

    SlotNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<SlotNode>;
        const name = node.name.map((expr) => (expr as R<Expr>).code).join("+");
        const children = node.content
          .map((child) => (child as R<Node>).code)
          .join("\n");
        node.code = `{renderSlot(data, ${name}, <>${children}</>)}`;
      },
    },

    TemplateNode: {
      exit(paths: NodePath) {},
    },

    InterpolationNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<InterpolationNode>;
        node.code = `{toString(${node.children
          .map((expr) => (expr as R<Expr>).code)
          .join(", ")})}`;
      },
    },

    ElementNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<ElementNode>;
        const tag = snakeToCamel(node.tag);

        // prepare attributes
        const attrs = node.props
          .filter((prop) => prop.type === NodeTypes.ATTRIBUTE)
          .map((prop) => (prop as R<AttributeNode>).code);
        if (isCustomComponent(node.tag)) {
          attrs.push(
            ...[
              "$isCustomComponent={this.$isCustomComponent}",
              `__tag='${node.tag}'`,
            ]
          );
        }

        // prepare children
        const children = node.children
          .map((item) => (item as R<Node>).code)
          .join("\n");

        if (children.length > 0) {
          node.code = `<${tag} ${attrs.join(" ")}>${children}</${tag}>`;
        } else {
          node.code = `<${tag} ${attrs.join(" ")}/>`;
        }
      },
    },

    DirectiveNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<DirectiveNode>;
        const value = node.value
          .map((item) => (item.expr as R<Expr>).code)
          .join(" + ");
        node.code = value;
      },
    },

    AttributeNode: {
      exit(paths: NodePath) {
        // skip
        if (paths.parent === undefined) return;

        const node = paths.node as R<AttributeNode>;
        const name = convertAttributeName(node.name);
        let value = node.value
          .map((item) => (item.expr as R<Expr>).code)
          .join(" + ");
        if (name.startsWith("on")) {
          const parent = paths.parent.node as R<ElementNode>;
          if (isCustomComponent(parent.tag)) {
            value = `$getComponentEventHandler(this, ${value})`;
          } else {
            value = `$getEventHandler(this, ${value})`;
          }
        }
        node.code = `${name}={${value}}`;
      },
    },

    VariableExpr: {
      exit(paths: NodePath) {
        const node = paths.node as R<VariableExpr>;
        if (isPredefinedVariable(node.value, paths)) {
          node.code = node.value;
        } else {
          node.code = `data["${node.value}"]`;
        }
      },
    },

    ConstantExpr: {
      exit(paths: NodePath) {
        const node = paths.node as R<ConstantExpr>;
        node.code = JSON.stringify(node.value);
      },
    },

    ObjectAccessExpr: {
      exit(paths: NodePath) {
        const node = paths.node as R<ObjectAccessExpr>;
        const expr = node.expr as R<Expr>;
        node.code = `${expr.code}.${node.paths.join(".")}`;
      },
    },

    ArithmeticExpr: {
      exit(paths: NodePath) {
        const node = paths.node as R<ArithmeticExpr>;
        const ops = {
          [ArithmeticOpTypes.ADD]: "+",
          [ArithmeticOpTypes.SUBTRACT]: "-",
          [ArithmeticOpTypes.MULTIPLE]: "*",
          [ArithmeticOpTypes.DIVIDE]: "/",
          [ArithmeticOpTypes.MODULE]: "%",
          [ArithmeticOpTypes.POWER]: "**",
        };
        const left = node.left as R<Expr>;
        const right = node.right as R<Expr>;
        node.code = `(${left.code} ${ops[node.op]} ${right.code})`;
      },
    },

    ConditionExpr: {
      exit(paths: NodePath) {
        const node = paths.node as R<ConditionExpr>;
        const ops = {
          [ConditionOpTypes.EQUAL]: "==",
          [ConditionOpTypes.DEEP_EQUAL]: "===",
          [ConditionOpTypes.NOT_EQUAL]: "!=",
          [ConditionOpTypes.DEEP_NOT_EQUAL]: "!==",
          [ConditionOpTypes.LESS_THAN]: "<",
          [ConditionOpTypes.LESS_THAN_EQUAL]: "<=",
          [ConditionOpTypes.GREATER_THAN]: ">",
          [ConditionOpTypes.GREATER_THAN_EQUAL]: ">=",
          [ConditionOpTypes.AND]: "&&",
          [ConditionOpTypes.OR]: "||",
        };
        const left = node.left as R<Expr>;
        const right = node.left as R<Expr>;
        node.code = `(${left.code} ${ops[node.op]} ${right.code})`;
      },
    },

    OneArgExpr: {
      exit(paths: NodePath) {
        const node = paths.node as R<OneArgExpr>;
        const ops = {
          [OneArgOpTypes.NOT]: "!",
          [OneArgOpTypes.MINUS]: "-",
        };
        const expr = node.expr as R<Expr>;
        node.code = `${ops[node.op]}${expr.code}`;
      },
    },

    TenaryExpr: {
      exit(paths: NodePath) {
        const node = paths.node as R<TenaryExpr>;
        const condition = node.condition as R<Expr>;
        const success = node.success as R<Expr>;
        const fail = node.fail as R<Expr>;
        node.code = `(${condition.code} ? ${success.code} : ${fail.code})`;
      },
    },

    ArrayExpr: {
      exit(paths: NodePath) {
        const node = paths.node as R<ArrayExpr>;
        node.code = `[
          ${node.children.map((expr) => (expr as R<Expr>).code).join(",")}
        ]`;
      },
    },

    ObjectExpr: {
      exit(paths: NodePath) {
        const node = paths.node as R<ObjectExpr>;
        node.code = `{
          ${node.destructuringList
            .map((item) => `...${(item as R<Expr>).code}`)
            .join(",\n")}
          ${node.props
            .map((prop) => `${prop.key}: ${(prop.value as R<Expr>).code}`)
            .join(",\n")}
        }`;
      },
    },
  };

  visit(createRootPath(root), visitor);
}
