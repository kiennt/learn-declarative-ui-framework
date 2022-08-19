export enum NodeTypes {
  ROOT,
  ELEMENT,
  ATTRIBUTE,
  DIRECTIVE,
  EXPR,
  IF,
  IF_BRANCH,
  FOR,
  BLOCK,
  SLOT,
  TEMPLATE,
  IMPORT,
  INCLUDE,
  SJS_IMPORT,
}

export type Node =
  | RootNode
  | ElementNode
  | AttributeNode
  | DirectiveNode
  | ExprNode
  | Expr
  | ControlNode;

export type ControlNode =
  | IfNode
  | ForNode
  | BlockNode
  | SlotNode
  | ImportNode
  | IncludeNode
  | SjsImportNode
  | TemplateNode;

export type RootNode = {
  type: NodeTypes.ROOT;
  children: Array<ElementNode | ControlNode>;
};

export type ElementNode = {
  type: NodeTypes.ELEMENT;
  tag: string;
  props: Array<AttributeNode | DirectiveNode>;
  children: Array<ElementNode | ExprNode | ControlNode>;
};

export type AttributeNode = {
  type: NodeTypes.ATTRIBUTE;
  name: string;
  value: Array<ExprNode>;
};

export type DirectiveNode = {
  type: NodeTypes.DIRECTIVE;
  name: string;
  prefix: string;
  value: Array<ExprNode>;
};

export type ExprNode = {
  type: NodeTypes.EXPR;
  expr: Expr;
};

export type IfBranchNode = {
  type: NodeTypes.IF_BRANCH;
  content: Node;
  condition?: Expr;
};

export type IfNode = {
  type: NodeTypes.IF;
  branches: Array<IfBranchNode>;
};

export type ForNode = {
  type: NodeTypes.FOR;
  data: Expr;
  itemName: string;
  indexName: string;
  content: Node;
};

export type SlotNode = {
  type: NodeTypes.SLOT;
  name: string;
  content: Node;
};

export type BlockNode = {
  type: NodeTypes.BLOCK;
  children: Array<Node>;
};

export type ImportNode = {
  type: NodeTypes.IMPORT;
  src: string;
};

export type IncludeNode = {
  type: NodeTypes.INCLUDE;
  src: string;
};

export type SjsImportNode = {
  type: NodeTypes.SJS_IMPORT;
  from: string;
  name: string;
};

export enum TemplateTypes {
  DEFINITION,
  INSTANCE,
}

export type TemplateNode = {
  type: NodeTypes.TEMPLATE;
  data?: Expr;
} & (
  | {
      templateType: TemplateTypes.INSTANCE;
      is: Array<Expr>;
    }
  | {
      templateType: TemplateTypes.DEFINITION;
      name: string;
      content: Array<Node>;
    }
);

export type Expr =
  | ConstantExpr
  | VariableExpr
  | ObjectAccessExpr
  | OneArgExpr
  | ArithmeticExpr
  | ConditionExpr
  | TenaryExpr
  | ArrayExpr
  | ObjectExpr
  | FunctionCallExpr;

export enum ExprTypes {
  CONSTANT,
  VARIABLE,
  OBJECT_ACCESS,
  ONE_ARG,
  ARITHMETIC,
  CONDITION,
  TENARY,
  ARRAY,
  OBJECT,
  FUNCTION_CALL,
}

export type ConstantExpr = {
  type: ExprTypes.CONSTANT;
  value: string | number | true | false | undefined | null;
};

export type VariableExpr = {
  type: ExprTypes.VARIABLE;
  value: string;
};

export type ObjectAccessExpr = {
  type: ExprTypes.OBJECT_ACCESS;
  expr: Expr;
  paths: Array<string>;
};

export enum OneArgOpTypes {
  MINUS,
  NOT,
}

export type OneArgExpr = {
  type: ExprTypes.ONE_ARG;
  op: OneArgOpTypes;
  expr: Expr;
};

export enum ArithmeticOpTypes {
  ADD,
  SUBTRACT,
  MULTIPLE,
  DIVIDE,
  MODULE,
  POWER,
}

export type ArithmeticExpr = {
  type: ExprTypes.ARITHMETIC;
  left: Expr;
  right: Expr;
  op: ArithmeticOpTypes;
};

export enum ConditionOpTypes {
  EQUAL,
  DEEP_EQUAL,
  NOT_EQUAL,
  DEEP_NOT_EQUAL,
  LESS_THAN,
  LESS_THAN_EQUAL,
  GREATER_THAN,
  GREATER_THAN_EQUAL,
  AND,
  OR,
}

export type ConditionExpr = {
  type: ExprTypes.CONDITION;
  left: Expr;
  right: Expr;
  op: ConditionOpTypes;
};

export type TenaryExpr = {
  type: ExprTypes.TENARY;
  condition: Expr;
  success: Expr;
  fail: Expr;
};

export type ArrayExpr = {
  type: ExprTypes.ARRAY;
  children: Array<Expr>;
};

export type ObjectProp = {
  key: string;
  value: Expr;
};

export type ObjectExpr = {
  type: ExprTypes.OBJECT;
  destructuringList: Array<Expr>;
  props: Array<ObjectProp>;
};

export type FunctionCallExpr = {
  type: ExprTypes.FUNCTION_CALL;
  fn: ObjectAccessExpr | VariableExpr;
  params: Array<Expr>;
};

export function trimSpaceInChildren(
  children: Array<ElementNode | ExprNode>
): Array<ElementNode | ExprNode> {
  let startNode = -1;
  const result: Array<ElementNode | ExprNode> = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.type === NodeTypes.ELEMENT) {
      startNode = i;
      result.push(child);
    } else {
      const expr = child.expr;
      const type = expr.type;
      if (type == ExprTypes.CONSTANT && typeof expr.value === "string") {
        // trim left
        if (startNode + 1 === i) {
          expr.value = expr.value.replace(/^[\s\t\r\n]*/g, "");
        }

        // trim right
        if (
          i + 1 === children.length ||
          children[i + 1].type === NodeTypes.ELEMENT
        ) {
          expr.value = expr.value.replace(/[\s\t\r\n]*$/g, "");
        }

        if (expr.value !== "") {
          result.push(child);
        }
      } else {
        result.push(child);
      }
    }
  }
  return result;
}

export function createRootNode(children: Array<ElementNode>): RootNode {
  return {
    type: NodeTypes.ROOT,
    children,
  };
}

export function createElementNode(
  tag: string,
  props: Array<AttributeNode>,
  children: Array<ElementNode | ExprNode>
): ElementNode {
  return {
    type: NodeTypes.ELEMENT,
    tag,
    props,
    children,
  };
}

export function createAttributeNode(
  name: string,
  value: Array<ExprNode>
): AttributeNode {
  return {
    type: NodeTypes.ATTRIBUTE,
    name,
    value: value.length > 0 ? value : [createExprNode(createConstantExpr(""))],
  };
}

export function createDirectiveNode(
  name: string,
  prefix: string,
  value: Array<ExprNode>
): DirectiveNode {
  return {
    type: NodeTypes.DIRECTIVE,
    name,
    prefix,
    value: value.length > 0 ? value : [createExprNode(createConstantExpr(""))],
  };
}

export function createIfBranchNode(
  content: Node,
  condition?: Expr
): IfBranchNode {
  return {
    type: NodeTypes.IF_BRANCH,
    content,
    condition,
  };
}

export function createIfNode(branches: Array<IfBranchNode>): IfNode {
  return {
    type: NodeTypes.IF,
    branches,
  };
}

export function createForNode(
  data: Expr,
  content: Node,
  itemName: string,
  indexName: string
): ForNode {
  return {
    type: NodeTypes.FOR,
    data,
    itemName,
    indexName,
    content,
  };
}

export function createBlockNode(children: Array<Node>): BlockNode {
  return {
    type: NodeTypes.BLOCK,
    children,
  };
}

export function createSlotNode(content: Node, name: string): SlotNode {
  return {
    type: NodeTypes.SLOT,
    name,
    content,
  };
}

export function createImportNode(src: string): ImportNode {
  return {
    type: NodeTypes.IMPORT,
    src,
  };
}

export function createIncludeNode(src: string): IncludeNode {
  return {
    type: NodeTypes.INCLUDE,
    src,
  };
}

// TODO: change name to support object like
// <sjs-import from="./index.sjs" name="{x, y: z}" />
export function createSjsImportNode(from: string, name: string): SjsImportNode {
  return {
    type: NodeTypes.SJS_IMPORT,
    from,
    name,
  };
}

export function createTemplateDefinedNode(
  name: string,
  content: Array<Node>,
  data?: Expr
): TemplateNode {
  return {
    type: NodeTypes.TEMPLATE,
    templateType: TemplateTypes.DEFINITION,
    name,
    content,
    data,
  };
}

export function createTemplateInstanceNode(
  is: Array<Expr>,
  data?: Expr
): TemplateNode {
  return {
    type: NodeTypes.TEMPLATE,
    templateType: TemplateTypes.INSTANCE,
    is,
    data,
  };
}

export function createExprNode(expr: Expr): ExprNode {
  return {
    type: NodeTypes.EXPR,
    expr,
  };
}

export function createConstantExpr(
  value: number | boolean | null | undefined | string
): ConstantExpr {
  return {
    type: ExprTypes.CONSTANT,
    value,
  };
}

export function createVariableExpr(value: string): VariableExpr {
  return {
    type: ExprTypes.VARIABLE,
    value,
  };
}

export function createObjectAccessExpr(
  expr: Expr,
  paths: Array<string>
): ObjectAccessExpr {
  return {
    type: ExprTypes.OBJECT_ACCESS,
    expr,
    paths,
  };
}

export function createOneArgExpr(op: OneArgOpTypes, expr: Expr): OneArgExpr {
  return {
    type: ExprTypes.ONE_ARG,
    op,
    expr,
  };
}

export function createArithmeticExpr(
  op: ArithmeticOpTypes,
  left: Expr,
  right: Expr
): ArithmeticExpr {
  return {
    type: ExprTypes.ARITHMETIC,
    op,
    left,
    right,
  };
}

export function createConditionExpr(
  op: ConditionOpTypes,
  left: Expr,
  right: Expr
): ConditionExpr {
  return {
    type: ExprTypes.CONDITION,
    op,
    left,
    right,
  };
}

export function createTenaryExpr(
  condition: Expr,
  success: Expr,
  fail: Expr
): TenaryExpr {
  return {
    type: ExprTypes.TENARY,
    condition,
    success,
    fail,
  };
}

export function createArrayExpr(children: Array<Expr>): ArrayExpr {
  return {
    type: ExprTypes.ARRAY,
    children,
  };
}

export function createObjectExpr(
  destructuringList: Array<Expr>,
  props: Array<ObjectProp>
): ObjectExpr {
  return {
    type: ExprTypes.OBJECT,
    destructuringList,
    props,
  };
}

export function createFunctionCallExpr(
  fn: VariableExpr | ObjectAccessExpr,
  params: Array<Expr>
): FunctionCallExpr {
  return {
    type: ExprTypes.FUNCTION_CALL,
    fn,
    params,
  };
}

export function createSyntaxError(_node: Node, message: string): Error {
  return Error(message);
}
