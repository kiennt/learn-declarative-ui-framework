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
      enter: PathVisitor;
      exit: PathVisitor;
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

function getEnterExit(visitor: NodeVisitor): {
  enter: PathVisitor;
  exit?: PathVisitor;
} {
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
  if (!visitor.ElementNode) return;
  const { enter, exit } = getEnterExit(visitor.ElementNode);
  enter.call(visitor, path);
  const node = path.node as ElementNode;
  node.props.forEach((prop) => visit(createPath(path, "props", prop), visitor));
  node.children.forEach((child) =>
    visit(createPath(path, "children", child), visitor)
  );
  if (exit) exit.call(visitor, path);
}

function visitAttributeNode(path: NodePath, visitor: Visitor): void {
  if (!visitor.AttributeNode) return;
  const { enter, exit } = getEnterExit(visitor.AttributeNode);
  enter.call(visitor, path);
  const node = path.node as AttributeNode;
  node.value.forEach((item) => visit(createPath(path, "value", item), visitor));
  if (exit) exit.call(visitor, path);
}

function visitDirectiveNode(path: NodePath, visitor: Visitor): void {
  if (!visitor.DirectiveNode) return;
  const { enter, exit } = getEnterExit(visitor.DirectiveNode);
  enter.call(visitor, path);
  const node = path.node as DirectiveNode;
  node.value.forEach((item) => visit(createPath(path, "value", item), visitor));
  if (exit) exit.call(visitor, path);
}

function visitConstainExpr(path: NodePath, visitor: Visitor): void {
  if (!visitor.ConstantExpr) return;
  const { enter, exit } = getEnterExit(visitor.ConstantExpr);
  enter.call(visitor, path);
  if (exit) exit.call(visitor, path);
}

function visitVariableExpr(path: NodePath, visitor: Visitor): void {
  if (!visitor.VariableExpr) return;
  const { enter, exit } = getEnterExit(visitor.VariableExpr);
  enter.call(visitor, path);
  if (exit) exit.call(visitor, path);
}

function visitObjectAccessExpr(path: NodePath, visitor: Visitor): void {
  if (!visitor.ObjectAccessExpr) return;
  const { enter, exit } = getEnterExit(visitor.ObjectAccessExpr);
  enter.call(visitor, path);
  const node = path.node as ObjectAccessExpr;
  visit(createPath(path, "expr", node.expr), visitor);
  if (exit) exit.call(visitor, path);
}

function visitOneArgExpr(path: NodePath, visitor: Visitor): void {
  if (!visitor.OneArgExpr) return;
  const { enter, exit } = getEnterExit(visitor.OneArgExpr);
  enter.call(visitor, path);
  const node = path.node as OneArgExpr;
  visit(createPath(path, "expr", node.expr), visitor);
  if (exit) exit.call(visitor, path);
}

function visitArithmeticExpr(path: NodePath, visitor: Visitor): void {
  if (!visitor.ArithmeticExpr) return;
  const { enter, exit } = getEnterExit(visitor.ArithmeticExpr);
  enter.call(visitor, path);
  const node = path.node as ArithmeticExpr;
  visit(createPath(path, "left", node.left), visitor);
  visit(createPath(path, "right", node.left), visitor);
  if (exit) exit.call(visitor, path);
}

function visitConditionExpr(path: NodePath, visitor: Visitor): void {
  if (!visitor.ConditionExpr) return;
  const { enter, exit } = getEnterExit(visitor.ConditionExpr);
  enter.call(visitor, path);
  const node = path.node as ConditionExpr;
  visit(createPath(path, "left", node.left), visitor);
  visit(createPath(path, "right", node.left), visitor);
  if (exit) exit.call(visitor, path);
}

function visitTenaryExpr(path: NodePath, visitor: Visitor): void {
  if (!visitor.TenaryExpr) return;
  const { enter, exit } = getEnterExit(visitor.TenaryExpr);
  enter.call(visitor, path);
  const node = path.node as TenaryExpr;
  visit(createPath(path, "condition", node.condition), visitor);
  visit(createPath(path, "success", node.success), visitor);
  visit(createPath(path, "fail", node.fail), visitor);
  if (exit) exit.call(visitor, path);
}

function visitArrayExpr(path: NodePath, visitor: Visitor): void {
  if (!visitor.ArrayExpr) return;
  const { enter, exit } = getEnterExit(visitor.ArrayExpr);
  enter.call(visitor, path);
  const node = path.node as ArrayExpr;
  node.children.forEach((child) =>
    visit(createPath(path, "children", child), visitor)
  );
  if (exit) exit.call(visitor, path);
}

function visitObjectExpr(path: NodePath, visitor: Visitor): void {
  if (!visitor.ObjectExpr) return;
  const { enter, exit } = getEnterExit(visitor.ObjectExpr);
  enter.call(visitor, path);
  const node = path.node as ObjectExpr;
  node.destructuringList.forEach((expr) =>
    visit(createPath(path, "destructuringList", expr), visitor)
  );
  node.props.forEach((prop) => {
    visit(createPath(path, "props", prop.value), visitor);
  });
  if (exit) exit.call(visitor, path);
}

function visitFunctionCallExpr(path: NodePath, visitor: Visitor): void {
  if (!visitor.FunctionCallExpr) return;
  const { enter, exit } = getEnterExit(visitor.FunctionCallExpr);
  enter.call(visitor, path);
  const node = path.node as FunctionCallExpr;
  visit(createPath(path, "fn", node.fn), visitor);
  node.params.forEach((param) =>
    visit(createPath(path, "params", param), visitor)
  );
  if (exit) exit.call(visitor, path);
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
        return visit({ isRoot: true, node: node.expr }, visitor);
      } else {
        return visit(createPath(path.parent, path.key, node.expr), visitor);
      }
    case ExprTypes.CONDITION:
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
