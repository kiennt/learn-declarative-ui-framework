import {
  createForNode,
  createSyntaxError,
  ElementNode,
  RootNode,
} from "../../parser/ast";
import { createRootPath, NodePath, replaceNode } from "../context";
import {
  getDiretiveName,
  getStringValueForDirective,
  removeDirectiveName,
} from "../utils";
import { visit } from "../visitor";

export default function plugin(root: RootNode): void {
  const visitor = {
    ElementNode: {
      exit(paths: NodePath) {
        const node = paths.node as ElementNode;
        const dir = getDiretiveName(node, "for");
        if (!dir) return;
        if (dir.value.length > 1) {
          throw createSyntaxError(node, "invalid for");
        }
        const indexName = getStringValueForDirective(
          node,
          "for-index",
          "index"
        );
        const itemName = getStringValueForDirective(node, "for-item", "item");
        removeDirectiveName(node, "for");
        removeDirectiveName(node, "for-index");
        removeDirectiveName(node, "for-item");
        const expr = dir.value[0].expr;
        replaceNode(paths, createForNode(expr, node, itemName, indexName));
      },
    },
  };
  visit(createRootPath(root), visitor);
}
