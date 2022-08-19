import {
  createIncludeNode,
  createSyntaxError,
  ElementNode,
  RootNode,
} from "../../parser/ast";
import { createRootPath, NodePath, replaceNode } from "../context";
import { getStringValueForAttribute } from "../utils";
import { visit } from "../visitor";

export default function plugin(root: RootNode): void {
  const visitor = {
    ElementNode: {
      exit(paths: NodePath) {
        const node = paths.node as ElementNode;
        if (node.tag !== "include") return;

        const src = getStringValueForAttribute(node, "src");
        if (src === undefined) {
          throw createSyntaxError(node, `include must have src`);
        }
        if (!src.endsWith(".txml")) {
          throw createSyntaxError(node, `import must has src ends with .txml`);
        }
        replaceNode(paths, createIncludeNode(src));
      },
    },
  };

  visit(createRootPath(root), visitor);
}
