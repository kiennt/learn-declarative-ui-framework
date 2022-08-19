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
} from "../../parser/ast";
import { visit } from "../visitor";
import {
  getDiretiveName,
  getStringValueForDirective,
  hasDirectiveName,
} from "../utils";
import { createRootPath, NodePath } from "../context";

type R<T> = T & {
  code: string;
  forIndex?: string;
  forItem?: string;
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
  if (name === node.forIndex) return true;
  if (name === node.forItem) return true;
  if (paths.parent === undefined) return false;
  return isPredefinedVariable(name, paths.parent);
}

export default function plugin(root: RootNode): string {
  const visitor = {
    RootNode: {
      exit(paths: NodePath) {
        const root = paths.node as R<RootNode>;
        const childrenCode = root.children
          .map((item) => (item as R<ElementNode>).code)
          .join("\n");
        if (root.children.length === 1) {
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

    ElementNode: {
      // prepare context for for loop
      enter(paths: NodePath) {
        const node = paths.node as R<ElementNode>;
        if (!hasDirectiveName(node, "for")) return;
        node.forIndex = getStringValueForDirective(node, "for-index", "index");
        node.forItem = getStringValueForDirective(node, "for-item", "item");
      },

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
        let children = "";
        let currentExpr = [];
        for (let child of node.children) {
          if (child.type === NodeTypes.ELEMENT) {
            if (currentExpr.length > 0) {
              children += `{toString(${currentExpr.join(", ")})}`;
            }
            children += (child as R<ElementNode>).code;
            currentExpr = [];
          } else {
            currentExpr.push((child.expr as R<Expr>).code);
          }
        }
        if (currentExpr.length > 0) {
          children += `{toString(${currentExpr.join(", ")})}`;
        }

        let code;
        if (tag === "Block") {
          code = `<>${children}</>`;
        } else {
          if (children.length > 0) {
            code = `<${tag} ${attrs.join(" ")}>${children}</${tag}>`;
          } else {
            code = `<${tag} ${attrs.join(" ")}/>`;
          }
        }

        // generate code for for-directive
        const forDirective = getDiretiveName(node, "for");
        if (forDirective) {
          const forDirectiveR = forDirective as R<DirectiveNode>;
          code = `
          <>
          {
            (${forDirectiveR.code}).map((${node.forItem}, ${node.forIndex}) => {
              return ${code}
            })
          }
          </>
          `;
        }

        node.code = code;
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
  return (root as R<RootNode>).code;
}
