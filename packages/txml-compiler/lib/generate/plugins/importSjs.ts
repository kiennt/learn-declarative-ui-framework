import {
  ElementNode,
  RootNode,
  createSjsImportNode,
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
        if (node.tag !== "import-sjs") return;

        const from = getStringValueForAttribute(node, "from");
        if (from === undefined) {
          throw createSyntaxError(node, `import-sjs must have from`);
        }
        if (!from.endsWith(".sjs")) {
          throw createSyntaxError(
            node,
            `import-sjs must has from ends with .sjs`
          );
        }
        const name = getStringValueForAttribute(node, "name");
        if (name === undefined) {
          throw createSyntaxError(node, `import-sjs must have name`);
        }
        replaceNode(paths, createSjsImportNode(from, name));
      }
    }
  };

  visit(createRootPath(root), visitor);
}
