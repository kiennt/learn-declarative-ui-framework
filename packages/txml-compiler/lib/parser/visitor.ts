import {
  ArithmeticExpr,
  ArrayExpr,
  AttributeNode,
  ConditionExpr,
  DirectiveNode,
  ElementNode,
  Expr,
  ExprNode,
  ExprTypes,
  FunctionCallExpr,
  NodeTypes,
  ObjectAccessExpr,
  ObjectExpr,
  OneArgExpr,
  TenaryExpr,
} from "./ast";

export type Node =
  | ElementNode
  | AttributeNode
  | DirectiveNode
  | ExprNode
  | Expr;

export type NodePath =
  | {
      node: Node;
      key: string;
      parent: NodePath;
      isRoot?: undefined;
    }
  | {
      node: Node;
      isRoot: true;
    };

export type PathVisitor = (path: NodePath) => void;

export type NodeVisitor =
  | {
      enter?: PathVisitor;
      exit?: PathVisitor;
    }
  | PathVisitor;

export interface Visitor {
  ElementNode?: NodeVisitor;
  AttributeNode?: NodeVisitor;
  DirectiveNode?: NodeVisitor;
  ExprNode?: NodeVisitor;
  ConstantExpr?: NodeVisitor;
  VariableExpr?: NodeVisitor;
  ObjectAccessExpr?: NodeVisitor;
  OneArgExpr?: NodeVisitor;
  ArithmeticExpr?: NodeVisitor;
  ConditionExpr?: NodeVisitor;
  TenaryExpr?: NodeVisitor;
  ArrayExpr?: NodeVisitor;
  ObjectExpr?: NodeVisitor;
  FunctionCallExpr?: NodeVisitor;
}

function getEnterExit(visitor?: NodeVisitor): {
  enter?: PathVisitor;
  exit?: PathVisitor;
} {
  if (!visitor) {
    return {};
  }

  if (typeof visitor === "function") {
    return {
      enter: visitor,
    };
  } else {
    return visitor;
  }
}

function createPath(parent: NodePath, key: string, node: Node): NodePath {
  return {
    parent,
    key,
    node,
  };
}

function visitElementNode(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.ElementNode);
  if (enter) enter.call(visitor, path);
  const node = path.node as ElementNode;
  node.props.forEach((prop) => visit(createPath(path, "props", prop), visitor));
  node.children.forEach((child) =>
    visit(createPath(path, "children", child), visitor)
  );
  if (exit) exit.call(visitor, path);
}

function visitAttributeNode(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.AttributeNode);
  if (enter) enter.call(visitor, path);
  const node = path.node as AttributeNode;
  node.value.forEach((item) => visit(createPath(path, "value", item), visitor));
  if (exit) exit.call(visitor, path);
}

function visitDirectiveNode(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.DirectiveNode);
  if (enter) enter.call(visitor, path);
  const node = path.node as DirectiveNode;
  node.value.forEach((item) => visit(createPath(path, "value", item), visitor));
  if (exit) exit.call(visitor, path);
}

function visitConstainExpr(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.ConstantExpr);
  if (enter) enter.call(visitor, path);
  if (exit) exit.call(visitor, path);
}

function visitVariableExpr(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.VariableExpr);
  if (enter) enter.call(visitor, path);
  if (exit) exit.call(visitor, path);
}

function visitObjectAccessExpr(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.ObjectAccessExpr);
  if (enter) enter.call(visitor, path);
  const node = path.node as ObjectAccessExpr;
  visitExprNode(createPath(path, "expr", node.expr), visitor);
  if (exit) exit.call(visitor, path);
}

function visitOneArgExpr(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.OneArgExpr);
  if (enter) enter.call(visitor, path);
  const node = path.node as OneArgExpr;
  visitExprNode(createPath(path, "expr", node.expr), visitor);
  if (exit) exit.call(visitor, path);
}

function visitArithmeticExpr(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.ArithmeticExpr);
  if (enter) enter.call(visitor, path);
  const node = path.node as ArithmeticExpr;
  visitExprNode(createPath(path, "left", node.left), visitor);
  visitExprNode(createPath(path, "right", node.right), visitor);
  if (exit) exit.call(visitor, path);
}

function visitConditionExpr(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.ConditionExpr);
  if (enter) enter.call(visitor, path);
  const node = path.node as ConditionExpr;
  visitExprNode(createPath(path, "left", node.left), visitor);
  visitExprNode(createPath(path, "right", node.left), visitor);
  if (exit) exit.call(visitor, path);
}

function visitTenaryExpr(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.TenaryExpr);
  if (enter) enter.call(visitor, path);
  const node = path.node as TenaryExpr;
  visitExprNode(createPath(path, "condition", node.condition), visitor);
  visitExprNode(createPath(path, "success", node.success), visitor);
  visitExprNode(createPath(path, "fail", node.fail), visitor);
  if (exit) exit.call(visitor, path);
}

function visitArrayExpr(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.ArrayExpr);
  if (enter) enter.call(visitor, path);
  const node = path.node as ArrayExpr;
  node.children.forEach((child) =>
    visitExprNode(createPath(path, "children", child), visitor)
  );
  if (exit) exit.call(visitor, path);
}

function visitObjectExpr(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.ObjectExpr);
  if (enter) enter.call(visitor, path);
  const node = path.node as ObjectExpr;
  node.destructuringList.forEach((expr) =>
    visitExprNode(createPath(path, "destructuringList", expr), visitor)
  );
  node.props.forEach((prop) => {
    visitExprNode(createPath(path, "props", prop.value), visitor);
  });
  if (exit) exit.call(visitor, path);
}

function visitFunctionCallExpr(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.FunctionCallExpr);
  if (enter) enter.call(visitor, path);
  const node = path.node as FunctionCallExpr;
  visitExprNode(createPath(path, "fn", node.fn), visitor);
  node.params.forEach((param) =>
    visitExprNode(createPath(path, "params", param), visitor)
  );
  if (exit) exit.call(visitor, path);
}

function visitExprNode(path: NodePath, visitor: Visitor): void {
  const node = path.node;
  switch (node.type) {
    case ExprTypes.CONSTANT:
      return visitConstainExpr(path, visitor);
    case ExprTypes.VARIABLE:
      return visitVariableExpr(path, visitor);
    case ExprTypes.OBJECT_ACCESS:
      return visitObjectAccessExpr(path, visitor);
    case ExprTypes.ONE_ARG:
      return visitOneArgExpr(path, visitor);
    case ExprTypes.ARITHMETIC:
      return visitArithmeticExpr(path, visitor);
    case ExprTypes.CONDITION:
      return visitConditionExpr(path, visitor);
    case ExprTypes.TENARY:
      return visitTenaryExpr(path, visitor);
    case ExprTypes.ARRAY:
      return visitArrayExpr(path, visitor);
    case ExprTypes.OBJECT:
      return visitObjectExpr(path, visitor);
    case ExprTypes.FUNCTION_CALL:
      return visitFunctionCallExpr(path, visitor);
  }
}

export function visit(path: NodePath, visitor: Visitor): void {
  const node = path.node;
  switch (node.type) {
    case NodeTypes.ELEMENT:
      return visitElementNode(path, visitor);
    case NodeTypes.ATTRIBUTE:
      return visitAttributeNode(path, visitor);
    case NodeTypes.DIRECTIVE:
      return visitDirectiveNode(path, visitor);
    case NodeTypes.EXPR:
      if (path.isRoot) {
        return visitExprNode({ isRoot: true, node: node.expr }, visitor);
      } else {
        return visitExprNode(
          createPath(path.parent, path.key, node.expr),
          visitor
        );
      }
  }
}
