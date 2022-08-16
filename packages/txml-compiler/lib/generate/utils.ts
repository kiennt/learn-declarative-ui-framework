import { ElementNode } from "../parser/ast";
import { NodePath } from "../parser/visitor";

export function createRootPath(node: ElementNode): NodePath {
  return {
    isRoot: true,
    node,
  };
}
