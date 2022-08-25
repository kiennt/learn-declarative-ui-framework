import {
  ElementNode,
  IncludeNode,
  RootNode,
  createIncludeNode,
  createSyntaxError
} from "../../parser/ast";
import { NodePath, createRootPath, replaceNode } from "../context";
import { getStringValueForAttribute } from "../utils";
import { visit } from "../visitor";
import { WithImportIndex, importPath } from "./import";

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

        const includeNode = createIncludeNode(
          src
        ) as WithImportIndex<IncludeNode>;
        includeNode.importIndex = importPath(root, src);
        replaceNode(paths, includeNode);
      }
    }
  };

  visit(createRootPath(root), visitor);
}
