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
} from "../../parser/ast";
import { NodePath, visit } from "../../parser/visitor";
import { createRootPath } from "../utils";

type R<T> = T & {
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

export default function plugin(nodes: Array<ElementNode>): string {
  const visitor = {
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

        if (tag === "Block") {
          node.code = `<>${children}</>`;
        } else {
          if (children.length > 0) {
            node.code = `<${tag} ${attrs.join(" ")}>${children}</${tag}>`;
          } else {
            node.code = `<${tag} ${attrs.join(" ")}/>`;
          }
        }
      },
    },

    AttributeNode: {
      exit(paths: NodePath) {
        // skip
        if (paths.isRoot) return;

        const node = paths.node as R<AttributeNode>;
        const name = convertAttributeName(node.name);
        let value = node.value
          .map((item) => `${(item.expr as R<Expr>).code}`)
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
        // TODO handle context
        node.code = `data["${node.value}"]`;
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

  nodes.forEach((node) => visit(createRootPath(node), visitor));
  const code = nodes.map((node) => (node as R<ElementNode>).code).join("\n");
  if (nodes.length === 1) {
    return `
  function render(data) {
    return ${code}
  }`;
  } else {
    return `
  function render(data) {
    return <>${code}</>
  }`;
  }
}
