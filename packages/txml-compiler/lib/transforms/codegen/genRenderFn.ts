import {
  ArithmeticExpr,
  ArithmeticOpTypes,
  ArrayExpr,
  AttributeNode,
  BlockNode,
  ConditionExpr,
  ConditionOpTypes,
  ConstantExpr,
  DirectiveNode,
  ElementNode,
  Expr,
  ExprTypes,
  ForNode,
  IfBranchNode,
  IfNode,
  ImportNode,
  IncludeNode,
  InterpolationNode,
  Node,
  NodeTypes,
  ObjectAccessExpr,
  ObjectExpr,
  OneArgExpr,
  OneArgOpTypes,
  RootNode,
  SlotNode,
  TemplateDefinitionNode,
  TemplateInstanceNode,
  TenaryExpr,
  VariableExpr
} from "../../parser/ast";
import { NodePath, createRootPath } from "../context";
import { WithImportIndex } from "../plugins/import";
import { visit } from "../visitor";

export type R<T> = T & {
  code: string;
};

export type RT<T> = T & {
  templates: Array<TemplateDefinitionNode>;
};

function snakeToCamel(value: string): string {
  return value
    .split("-")
    .map(a => {
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

function getCodeOfArray(_items: Array<Node>): string {
  const items = _items.filter(
    item =>
      item.type !== NodeTypes.TEMPLATE_DEFINITION &&
      item.type !== NodeTypes.IMPORT
  );
  if (items.length === 0) {
    return "null";
  }

  const childrenCode = items.map(item => (item as R<Node>).code).join("\n");
  const useFragment =
    items.length > 1 ||
    items.filter(item =>
      (
        [
          NodeTypes.IF,
          NodeTypes.FOR,
          NodeTypes.TEMPLATE_INSTANCE,
          NodeTypes.INTERPOLATION,
          NodeTypes.INCLUDE
        ] as Array<NodeTypes | ExprTypes>
      ).includes(item.type)
    ).length > 0;
  return useFragment ? `<>${childrenCode}</>` : `(${childrenCode})`;
}

export default function plugin(root: RootNode): void {
  const templates: Array<TemplateDefinitionNode> = [];
  const imports: Array<R<WithImportIndex<ImportNode | IncludeNode>>> = [];

  const visitor = {
    RootNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<RootNode>;
        const importCode = imports
          .map(node => {
            if (node.type === NodeTypes.IMPORT) {
              return `import { $ownTemplates as template${node.importIndex} } from "${node.src}";`;
            } else {
              return `import template${node.importIndex} from "${node.src}";`;
            }
          })
          .join("\n");
        node.code = `
${importCode}
let $template = void 0;
export const $ownTemplates = {};

${templates.map(item => (item as R<TemplateDefinitionNode>).code).join("\n")}
const $templates = {
  ${imports
    .filter(item => item.type === NodeTypes.IMPORT)
    .map(item => `...template${item.importIndex},`)
    .join("\n")}
  ...$ownTemplates
};
export default function render(data) {
  return ${getCodeOfArray(node.children)};
}`;
      }
    },

    ForNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<ForNode>;
        const { itemName: item, indexName: index } = node;
        node.code = `
        {
          iterate(${(node.data as R<Expr>).code}, (${item}, ${index}) => {
            return ${(node.content as R<Node>).code};
          })
        }
        `;
      }
    },

    IfNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<IfNode>;
        const hasElseCondition =
          node.branches.filter(branch => branch.condition === undefined)
            .length > 0;
        node.code = `${node.branches
          .map(child => (child as R<Node>).code)
          .join(": \n")}`;
        if (!hasElseCondition) {
          node.code += " : null";
        }
        node.code = `{ ${node.code} }`;
      }
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
      }
    },

    BlockNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<BlockNode>;
        node.code = `
          <>
          ${node.children.map(item => (item as R<Node>).code).join("\n")}
          </>
        `;
      }
    },

    ImportNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<WithImportIndex<ImportNode>>;
        imports.push(node);
      }
    },

    IncludeNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<WithImportIndex<IncludeNode>>;
        node.code = `{template${node.importIndex}.apply(this, arguments)}`;
        imports.push(node);
      }
    },

    SlotNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<SlotNode>;
        const name = node.name.map(expr => (expr as R<Expr>).code).join("+");
        const children = node.content
          .map(child => (child as R<Node>).code)
          .join("\n");
        node.code = `{renderSlot(data, ${name}, <>${children}</>)}`;
      }
    },

    TemplateDefinitionNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<TemplateDefinitionNode>;
        node.code = `
$template = $ownTemplates['${node.name}'] = function(data) {
  return ${getCodeOfArray(node.content)};
}
$template.Component = createTemplate('${node.name}', $template);
`;
        templates.push(node);
      }
    },

    TemplateInstanceNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<TemplateInstanceNode>;
        let data = undefined;
        if (node.data) {
          if (
            node.data.length === 1 &&
            node.data[0].type === ExprTypes.VARIABLE
          ) {
            const name = node.data[0].value;
            data = `{${name}: data['${name}']}`;
          } else {
            data = node.data.map(item => (item as R<Expr>).code).join("");
          }
        }
        const is = node.is.map(item => (item as R<Expr>).code).join("+");
        node.code = `{useTemplate($templates[${is}], ${data}, undefined, this)}`;
      }
    },

    InterpolationNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<InterpolationNode>;
        node.code = `{toString(${node.children
          .map(expr => (expr as R<Expr>).code)
          .join(", ")})}`;
      }
    },

    ElementNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<ElementNode>;
        const tag = snakeToCamel(node.tag);

        // prepare attributes
        const attrs = node.props
          .filter(prop => prop.type === NodeTypes.ATTRIBUTE)
          .map(prop => (prop as R<AttributeNode>).code);
        if (isCustomComponent(node.tag)) {
          attrs.push(
            ...[
              "$isCustomComponent={this.$isCustomComponent}",
              `__tag='${node.tag}'`
            ]
          );
        }

        // prepare children
        const children = node.children
          .map(item => (item as R<Node>).code)
          .join("\n");

        if (children.length > 0) {
          node.code = `<${tag} ${attrs.join(" ")}>${children}</${tag}>`;
        } else {
          node.code = `<${tag} ${attrs.join(" ")}/>`;
        }
      }
    },

    DirectiveNode: {
      exit(paths: NodePath) {
        const node = paths.node as R<DirectiveNode>;
        const value = node.value
          .map(item => (item.expr as R<Expr>).code)
          .join(" + ");
        node.code = value;
      }
    },

    AttributeNode: {
      exit(paths: NodePath) {
        // skip
        if (paths.parent === undefined) return;

        const node = paths.node as R<AttributeNode>;
        const name = convertAttributeName(node.name);
        let value = node.value
          .map(item => (item.expr as R<Expr>).code)
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
      }
    },

    VariableExpr: {
      exit(paths: NodePath) {
        const node = paths.node as R<VariableExpr>;
        if (isPredefinedVariable(node.value, paths)) {
          node.code = node.value;
        } else {
          node.code = `data["${node.value}"]`;
        }
      }
    },

    ConstantExpr: {
      exit(paths: NodePath) {
        const node = paths.node as R<ConstantExpr>;
        node.code = JSON.stringify(node.value);
      }
    },

    ObjectAccessExpr: {
      exit(paths: NodePath) {
        const node = paths.node as R<ObjectAccessExpr>;
        const expr = node.expr as R<Expr>;
        node.code = `getLooseDataMember(${expr.code}, ${node.paths
          .map(item => `'${item}'`)
          .join(",")})`;
      }
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
          [ArithmeticOpTypes.POWER]: "**"
        };
        const left = node.left as R<Expr>;
        const right = node.right as R<Expr>;
        node.code = `(${left.code} ${ops[node.op]} ${right.code})`;
      }
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
          [ConditionOpTypes.OR]: "||"
        };
        const left = node.left as R<Expr>;
        const right = node.left as R<Expr>;
        node.code = `(${left.code} ${ops[node.op]} ${right.code})`;
      }
    },

    OneArgExpr: {
      exit(paths: NodePath) {
        const node = paths.node as R<OneArgExpr>;
        const ops = {
          [OneArgOpTypes.NOT]: "!",
          [OneArgOpTypes.MINUS]: "-"
        };
        const expr = node.expr as R<Expr>;
        node.code = `${ops[node.op]}${expr.code}`;
      }
    },

    TenaryExpr: {
      exit(paths: NodePath) {
        const node = paths.node as R<TenaryExpr>;
        const condition = node.condition as R<Expr>;
        const success = node.success as R<Expr>;
        const fail = node.fail as R<Expr>;
        node.code = `(${condition.code} ? ${success.code} : ${fail.code})`;
      }
    },

    ArrayExpr: {
      exit(paths: NodePath) {
        const node = paths.node as R<ArrayExpr>;
        node.code = `[
          ${node.children.map(expr => (expr as R<Expr>).code).join(",")}
        ]`;
      }
    },

    ObjectExpr: {
      exit(paths: NodePath) {
        const node = paths.node as R<ObjectExpr>;
        node.code = `{
          ${node.destructuringList
            .map(item => `...${(item as R<Expr>).code}`)
            .join(",\n")}
          ${node.props
            .map(prop => `${prop.key}: ${(prop.value as R<Expr>).code}`)
            .join(",\n")}
        }`;
      }
    }
  };

  visit(createRootPath(root), visitor);
}
