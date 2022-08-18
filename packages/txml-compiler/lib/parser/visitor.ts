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
} from "./ast";

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

function createPath(parent: NodePath, key: string, node: Node): NodePath {
  return {
    parent,
    key,
    node,
  };
}

/**
 * return child of a object by path
 * E.g
 *   target = { name: "top", teams: [{
 *     name: "engineering",
 *     count: 4,
 *     members: ["kien", "cuong", "hung", "han"]
 *   }]}
 *   getChildByPath(target, "name") -> "top"
 *   getChildByPath(target, "teams.0.name") -> "engineering"
 *   getChildByPath(target, "teams.0.members.1") -> "cuong"
 * @param target
 * @param path
 */
function getChildByPath(target: any, paths: string): any {
  return paths.split(".").reduce((result, key) => result[key], target);
}

function setChildByPath(target: any, paths: string, value: any): any {
  const items = paths.split(".");
  const parent = items
    .slice(0, -1)
    .reduce((result, key) => result[key], target);
  parent[items[items.length - 1]] = value;
}

function replaceNode(path: NodePath, newNode: Node): void {}

export type PathVisitor = (path: NodePath) => void;

export type NodeVisitor =
  | {
      enter?: PathVisitor;
      exit?: PathVisitor;
    }
  | PathVisitor;

export interface Visitor {
  RootNode?: NodeVisitor;
  ElementNode?: NodeVisitor;
  AttributeNode?: NodeVisitor;
  DirectiveNode?: NodeVisitor;
  IfNode?: NodeVisitor;
  ForNode?: NodeVisitor;
  BlockNode?: NodeVisitor;
  SlotNode?: NodeVisitor;
  ImportNode?: NodeVisitor;
  IncludeNode?: NodeVisitor;
  SjsImportNode?: NodeVisitor;
  TemplateNode?: NodeVisitor;
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

function visitRootNode(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.RootNode);
  if (enter) enter.call(visitor, path);
  const node = path.node as RootNode;
  node.children.forEach((child, index) =>
    visit(createPath(path, `children.${index}`, child), visitor)
  );
  if (exit) exit.call(visitor, path);
}

function visitElementNode(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.ElementNode);
  if (enter) enter.call(visitor, path);
  const node = path.node as ElementNode;
  node.props.forEach((prop) => visit(createPath(path, "props", prop), visitor));
  node.children.forEach((child, index) =>
    visit(createPath(path, `children.${index}`, child), visitor)
  );
  if (exit) exit.call(visitor, path);
}

function visitAttributeNode(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.AttributeNode);
  if (enter) enter.call(visitor, path);
  const node = path.node as AttributeNode;
  node.value.forEach((item, index) =>
    visit(createPath(path, `value.${index}`, item), visitor)
  );
  if (exit) exit.call(visitor, path);
}

function visitDirectiveNode(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.DirectiveNode);
  if (enter) enter.call(visitor, path);
  const node = path.node as DirectiveNode;
  node.value.forEach((item, index) =>
    visit(createPath(path, `value.${index}`, item), visitor)
  );
  if (exit) exit.call(visitor, path);
}

function visitIfNode(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.IfNode);
  if (enter) enter.call(visitor, path);
  const node = path.node as IfNode;
  visit(createPath(path, "condition", node.condition), visitor);
  visit(createPath(path, "ifBranch", node.ifBranch), visitor);
  if (node.elseBranch) {
    visit(createPath(path, "elseBranch", node.elseBranch), visitor);
  }
  if (exit) exit.call(visitor, path);
}

function visitForNode(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.ForNode);
  if (enter) enter.call(visitor, path);
  const node = path.node as ForNode;
  visit(createPath(path, "data", node.data), visitor);
  visit(createPath(path, "content", node.content), visitor);
  if (exit) exit.call(visitor, path);
}

function visitBlockNode(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.BlockNode);
  if (enter) enter.call(visitor, path);
  const node = path.node as BlockNode;
  visit(createPath(path, "content", node.content), visitor);
  if (exit) exit.call(visitor, path);
}

function visitSlotNode(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.SlotNode);
  if (enter) enter.call(visitor, path);
  const node = path.node as SlotNode;
  visit(createPath(path, "content", node.content), visitor);
  if (exit) exit.call(visitor, path);
}

function visitImportNode(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.ImportNode);
  if (enter) enter.call(visitor, path);
  if (exit) exit.call(visitor, path);
}

function visitIncludeNode(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.IncludeNode);
  if (enter) enter.call(visitor, path);
  if (exit) exit.call(visitor, path);
}

function visitSjsImportNode(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.SjsImportNode);
  if (enter) enter.call(visitor, path);
  if (exit) exit.call(visitor, path);
}

function visitTemplateNode(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.TemplateNode);
  if (enter) enter.call(visitor, path);
  const node = path.node as TemplateNode;
  if (node.data) visit(createPath(path, "data", node.data), visitor);
  if (node.templateType === TemplateTypes.DEFINITION) {
    visit(createPath(path, "name", node.content), visitor);
    visit(createPath(path, "content", node.content), visitor);
  } else {
    visit(createPath(path, "is", node.is), visitor);
  }
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
  node.children.forEach((child, index) =>
    visitExprNode(createPath(path, `children.${index}`, child), visitor)
  );
  if (exit) exit.call(visitor, path);
}

function visitObjectExpr(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.ObjectExpr);
  if (enter) enter.call(visitor, path);
  const node = path.node as ObjectExpr;
  node.destructuringList.forEach((expr, index) =>
    visitExprNode(createPath(path, `destructuringList.${index}`, expr), visitor)
  );
  node.props.forEach((prop, index) => {
    visitExprNode(createPath(path, `props.${index}`, prop.value), visitor);
  });
  if (exit) exit.call(visitor, path);
}

function visitFunctionCallExpr(path: NodePath, visitor: Visitor): void {
  const { enter, exit } = getEnterExit(visitor.FunctionCallExpr);
  if (enter) enter.call(visitor, path);
  const node = path.node as FunctionCallExpr;
  visitExprNode(createPath(path, "fn", node.fn), visitor);
  node.params.forEach((param, index) =>
    visitExprNode(createPath(path, `params.${index}`, param), visitor)
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
    case NodeTypes.EXPR:
      return visitExprNode(createPath(path, "expr", node.expr), visitor);
  }
}
