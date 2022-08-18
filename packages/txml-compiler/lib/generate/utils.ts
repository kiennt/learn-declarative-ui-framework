import { RootNode } from "../parser/ast";
import { NodePath } from "../parser/visitor";

export function createRootPath(node: RootNode): NodePath {
  return {
    isRoot: true,
    node,
  };
}
