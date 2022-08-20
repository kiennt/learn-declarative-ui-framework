import {
  NodeTypes,
  Node,
  AttributeNode,
  DirectiveNode,
  ElementNode,
  IfNode,
  ForNode,
  ExprTypes,
  ArithmeticExpr,
  ArrayExpr,
  ConditionExpr,
  FunctionCallExpr,
  ObjectAccessExpr,
  ObjectExpr,
  OneArgExpr,
  TenaryExpr,
  BlockNode,
  SlotNode,
  TemplateNode,
  TemplateTypes,
  RootNode,
  IfBranchNode,
  InterpolationNode,
} from "../parser/ast";
import { createPath, NodePath } from "./context";

export type PathVisitor = (path: NodePath) => void;

export type NodeVisitor =
  | {
      enter?: PathVisitor;
      exit?: PathVisitor;
    }
  | PathVisitor;

type VisitFn = (path: NodePath, visitor: Visitor) => void;

export interface Visitor {
  RootNode?: NodeVisitor;
  ElementNode?: NodeVisitor;
  AttributeNode?: NodeVisitor;
  DirectiveNode?: NodeVisitor;
  IfNode?: NodeVisitor;
  IfBranchNode?: NodeVisitor;
  ForNode?: NodeVisitor;
  BlockNode?: NodeVisitor;
  SlotNode?: NodeVisitor;
  ImportNode?: NodeVisitor;
  IncludeNode?: NodeVisitor;
  ImportSjsNode?: NodeVisitor;
  TemplateNode?: NodeVisitor;
  InterpolationNode?: NodeVisitor;
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

function visitListChildren(
  path: NodePath,
  children: Array<Node>,
  prefix: string,
  visitor: Visitor,
  fn: VisitFn = visit
): void {
  let index = 0;
  const onNodeRemoved = () => {
    index--;
  };
  for (; index < children.length; index++) {
    const child = children[index];
    const nextPath = createPath(path, prefix, child, index, onNodeRemoved);
    fn(nextPath, visitor);
  }
}

function doVisitNode(
  path: NodePath,
  visitor: Visitor,
  key: keyof Visitor,
  fn: VisitFn
): void {
  const { enter, exit } = getEnterExit(visitor[key]);
  if (enter) enter.call(visitor, path);
  fn(path, visitor);
  if (exit) exit.call(visitor, path);
}

function visitRootNode(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "RootNode", (path, visitor) => {
    const node = path.node as RootNode;
    visitListChildren(path, node.children, "children", visitor);
  });
}

function visitElementNode(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "ElementNode", (path, visitor) => {
    const node = path.node as ElementNode;
    visitListChildren(path, node.props, "props", visitor);
    visitListChildren(path, node.children, "children", visitor);
  });
}

function visitAttributeNode(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "AttributeNode", (path, visitor) => {
    const node = path.node as AttributeNode;
    visitListChildren(path, node.value, "value", visitor);
  });
}

function visitDirectiveNode(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "DirectiveNode", (path, visitor) => {
    const node = path.node as DirectiveNode;
    visitListChildren(path, node.value, "value", visitor);
  });
}

function visitIfNode(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "IfNode", (path, visitor) => {
    const node = path.node as IfNode;
    visitListChildren(path, node.branches, "branches", visitor);
  });
}

function visitIfBranchNode(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "IfBranchNode", (path, visitor) => {
    const node = path.node as IfBranchNode;
    visit(createPath(path, "content", node.content), visitor);
    if (node.condition) {
      visitExprNode(createPath(path, "condition", node.condition), visitor);
    }
  });
}

function visitForNode(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "ForNode", (path, visitor) => {
    const node = path.node as ForNode;
    visitExprNode(createPath(path, "data", node.data), visitor);
    visit(createPath(path, "content", node.content), visitor);
  });
}

function visitBlockNode(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "BlockNode", (path, visitor) => {
    const node = path.node as BlockNode;
    visitListChildren(path, node.children, "children", visitor);
  });
}

function visitSlotNode(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "SlotNode", (path, visitor) => {
    const node = path.node as SlotNode;
    visitListChildren(path, node.name, "name", visitor, visitExprNode);
    visitListChildren(path, node.content, "content", visitor);
  });
}

function visitImportNode(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "ImportNode", (_path, _visitor) => {});
}

function visitIncludeNode(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "IncludeNode", (_path, _visitor) => {});
}

function visitSjsImportNode(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "ImportSjsNode", (_path, _visitor) => {});
}

function visitTemplateNode(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "TemplateNode", (path, visitor) => {
    const node = path.node as TemplateNode;
    if (node.data) visit(createPath(path, "data", node.data), visitor);
    if (node.templateType === TemplateTypes.DEFINITION) {
      visitListChildren(path, node.content, "content", visitor);
    } else {
      visitListChildren(path, node.is, "is", visitor, visitExprNode);
    }
  });
}

function visitInterpolationNode(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "InterpolationNode", (path, visitor) => {
    const node = path.node as InterpolationNode;
    visitListChildren(path, node.children, "children", visitor, visitExprNode);
  });
}

function visitConstainExpr(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "ConstantExpr", (_path, _visitor) => {});
}

function visitVariableExpr(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "VariableExpr", (_path, _visitor) => {});
}

function visitObjectAccessExpr(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "ObjectAccessExpr", (path, visitor) => {
    const node = path.node as ObjectAccessExpr;
    visitExprNode(createPath(path, "expr", node.expr), visitor);
  });
}

function visitOneArgExpr(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "OneArgExpr", (path, visitor) => {
    const node = path.node as OneArgExpr;
    visitExprNode(createPath(path, "expr", node.expr), visitor);
  });
}

function visitArithmeticExpr(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "ArithmeticExpr", (path, visitor) => {
    const node = path.node as ArithmeticExpr;
    visitExprNode(createPath(path, "left", node.left), visitor);
    visitExprNode(createPath(path, "right", node.right), visitor);
  });
}

function visitConditionExpr(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "ConditionExpr", (path, visitor) => {
    const node = path.node as ConditionExpr;
    visitExprNode(createPath(path, "left", node.left), visitor);
    visitExprNode(createPath(path, "right", node.left), visitor);
  });
}

function visitTenaryExpr(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "TenaryExpr", (path, visitor) => {
    const node = path.node as TenaryExpr;
    visitExprNode(createPath(path, "condition", node.condition), visitor);
    visitExprNode(createPath(path, "success", node.success), visitor);
    visitExprNode(createPath(path, "fail", node.fail), visitor);
  });
}

function visitArrayExpr(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "ArrayExpr", (path, visitor) => {
    const node = path.node as ArrayExpr;
    visitListChildren(path, node.children, "children", visitor, visitExprNode);
  });
}

function visitObjectExpr(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "ObjectExpr", (path, visitor) => {
    const node = path.node as ObjectExpr;
    visitListChildren(
      path,
      node.destructuringList,
      "destructuringList",
      visitor,
      visitExprNode
    );
    visitListChildren(
      path,
      node.props.map((prop) => prop.value),
      "props",
      visitor,
      visitExprNode
    );
  });
}

function visitFunctionCallExpr(path: NodePath, visitor: Visitor): void {
  doVisitNode(path, visitor, "FunctionCallExpr", (path, visitor) => {
    const node = path.node as FunctionCallExpr;
    visitExprNode(createPath(path, "fn", node.fn), visitor);
    visitListChildren(path, node.params, "params", visitor, visitExprNode);
  });
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
    case NodeTypes.ROOT:
      return visitRootNode(path, visitor);
    case NodeTypes.ELEMENT:
      return visitElementNode(path, visitor);
    case NodeTypes.ATTRIBUTE:
      return visitAttributeNode(path, visitor);
    case NodeTypes.DIRECTIVE:
      return visitDirectiveNode(path, visitor);
    case NodeTypes.IF:
      return visitIfNode(path, visitor);
    case NodeTypes.IF_BRANCH:
      return visitIfBranchNode(path, visitor);
    case NodeTypes.FOR:
      return visitForNode(path, visitor);
    case NodeTypes.BLOCK:
      return visitBlockNode(path, visitor);
    case NodeTypes.SLOT:
      return visitSlotNode(path, visitor);
    case NodeTypes.IMPORT:
      return visitImportNode(path, visitor);
    case NodeTypes.INCLUDE:
      return visitIncludeNode(path, visitor);
    case NodeTypes.SJS_IMPORT:
      return visitSjsImportNode(path, visitor);
    case NodeTypes.TEMPLATE:
      return visitTemplateNode(path, visitor);
    case NodeTypes.INTERPOLATION:
      return visitInterpolationNode(path, visitor);
    case NodeTypes.EXPR:
      return visitExprNode(createPath(path, "expr", node.expr), visitor);
  }
}
