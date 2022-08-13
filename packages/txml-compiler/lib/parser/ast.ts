export enum NodeTypes {
  ELEMENT,
  ATTRIBUTE,
  DIRECTIVE,
  EXPR,
}

export type ElementNode = {
  type: NodeTypes.ELEMENT;
  tag: string;
  props: Array<AttributeNode | DirectiveNode>;
  children: Array<ElementNode | ExprNode>;
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
  key: VariableExpr;
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
    value,
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
    value,
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
