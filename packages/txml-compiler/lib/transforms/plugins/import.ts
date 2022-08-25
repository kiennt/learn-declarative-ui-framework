import {
  ElementNode,
  ImportNode,
  RootNode,
  createImportNode,
  createSyntaxError
} from "../../parser/ast";
import { NodePath, createRootPath, replaceNode } from "../context";
import { getStringValueForAttribute } from "../utils";
import { visit } from "../visitor";

export type WithImport<T> = T & {
  importPaths: Array<string>;
};

export type WithImportIndex<T> = T & {
  importIndex: number;
};

export function importPath(_root: RootNode, path: string): number {
  const root = _root as WithImport<RootNode>;
  if (root.importPaths == undefined) {
    root.importPaths = [];
  }

  let i = 0;
  for (; i < root.importPaths.length; i++) {
    const item = root.importPaths[i];
    if (item === path) return i;
  }

  root.importPaths.push(path);
  return i;
}

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

        const importNode = createImportNode(src) as WithImportIndex<ImportNode>;
        importNode.importIndex = importPath(root, src);
        replaceNode(paths, importNode);
      }
    }
  };

  visit(createRootPath(root), visitor);
}
