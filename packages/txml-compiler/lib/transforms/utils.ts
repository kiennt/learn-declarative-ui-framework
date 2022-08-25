import {
  AttributeNode,
  DirectiveNode,
  ElementNode,
  ExprTypes,
  NodeTypes,
  createSyntaxError
} from "../parser/ast";

const opts = {
  prefixes: ["tiki"],
  library: "@tiki/tf-miniapp",
  rmlRuntimeLibraryName: "@hoangviet/rml-runtime"
};

export function getOpts(name: keyof typeof opts) {
  return opts[name];
}

export function setOpts(name: keyof typeof opts, value: any) {
  opts[name] = value;
}

export function getDiretiveName(
  node: ElementNode,
  name: string
): DirectiveNode | undefined {
  return node.props
    .filter(
      prop =>
        prop.type === NodeTypes.DIRECTIVE &&
        opts.prefixes.includes(prop.prefix) &&
        prop.name === name
    )
    .slice(-1)[0] as DirectiveNode | undefined;
}

export function getAttributeName(
  node: ElementNode,
  name: string
): AttributeNode | undefined {
  return node.props
    .filter(prop => prop.type === NodeTypes.ATTRIBUTE && prop.name === name)
    .slice(-1)[0] as AttributeNode | undefined;
}

export function hasDirectiveName(node: ElementNode, name: string): boolean {
  return getDiretiveName(node, name) !== undefined;
}

export function removeDirectiveName(node: ElementNode, name: string): void {
  node.props = node.props.filter(prop => {
    return !(prop.type === NodeTypes.DIRECTIVE && prop.name === name);
  });
}

/**
 * get string value for a directive
 *
 * with name = "for-index"
 * <view for-index="hello" /> --> hello
 * <view for-index={{"hello"}} /> --> hello
 * <view for-index={{a}} /> --> throws error
 * <view for-index={{a + b}} /> --> throws error
 * <view /> --> index
 *
 * @param node
 * @param name
 * @param prefixes
 * @returns
 */
export function getStringValueForDirective(
  node: ElementNode,
  name: string,
  defaultValue: string
): string {
  const item = getDiretiveName(node, name);
  if (item === undefined) {
    return defaultValue;
  }

  if (item.value.length > 1) {
    throw createSyntaxError(node, `directive ${item.name} must have 1 value`);
  }
  const expr = item.value[0].expr;
  if (expr.type !== ExprTypes.CONSTANT) {
    throw createSyntaxError(node, `directive ${item.name} must be a constant`);
  }
  if (typeof expr.value !== "string") {
    throw createSyntaxError(node, `directive ${item.name} must be a string`);
  }
  return expr.value;
}

/**
 * get string value for an attribute
 *
 * with name = "name"
 * <view name="hello" /> --> hello
 * <view name={{"hello"}} /> --> hello
 * <view name={{a}} /> --> throws error
 * <view name={{a + b}} /> --> throws error
 * <view /> --> index
 *
 * @param node
 * @param name
 * @param prefixes
 * @returns
 */
export function getStringValueForAttribute(
  node: ElementNode,
  name: string
): string | undefined {
  const item = getAttributeName(node, name);
  if (item === undefined) {
    return;
  }

  if (item.value.length > 1) {
    throw createSyntaxError(node, `directive ${item.name} must have 1 value`);
  }
  const expr = item.value[0].expr;
  if (expr.type !== ExprTypes.CONSTANT) {
    throw createSyntaxError(node, `directive ${item.name} must be a constant`);
  }
  if (typeof expr.value !== "string") {
    throw createSyntaxError(node, `directive ${item.name} must be a string`);
  }
  return expr.value;
}
