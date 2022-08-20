import {
  ElementNode,
  RootNode,
  createImportNode,
  createSyntaxError
} from "../../parser/ast";
import { NodePath, createRootPath, replaceNode } from "../context";
import { getStringValueForAttribute } from "../utils";
import { visit } from "../visitor";

export default function plugin(root: RootNode): void {
  const visitor = {
    ElementNode: {
      exit(paths: NodePath) {
        const node = paths.node as ElementNode;
        if (node.tag !== "import") return;

        const src = getStringValueForAttribute(node, "src");
        if (src === undefined) {
          throw createSyntaxError(node, `import must have src`);
        }
        if (!src.endsWith(".txml")) {
          throw createSyntaxError(node, `import must has src ends with .txml`);
        }
        replaceNode(paths, createImportNode(src));
      }
    }
  };

  visit(createRootPath(root), visitor);
}
