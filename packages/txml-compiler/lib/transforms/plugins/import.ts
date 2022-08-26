import {
  ElementNode,
  ImportNode,
  IncludeNode,
  RootNode,
  createImportNode,
  createIncludeNode,
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

function convertElementToImportNode(
  root: RootNode,
  paths: NodePath,
  node: ElementNode
) {
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

function convertElementToIncludeNode(
  root: RootNode,
  paths: NodePath,
  node: ElementNode
) {
  const src = getStringValueForAttribute(node, "src");
  if (src === undefined) {
    throw createSyntaxError(node, `include must have src`);
  }
  if (!src.endsWith(".txml")) {
    throw createSyntaxError(node, `import must has src ends with .txml`);
  }

  const includeNode = createIncludeNode(src) as WithImportIndex<IncludeNode>;
  includeNode.importIndex = importPath(root, src);
  replaceNode(paths, includeNode);
}

export default function plugin(root: RootNode): void {
  const visitor = {
    ElementNode: {
      exit(paths: NodePath) {
        const node = paths.node as ElementNode;
        if (node.tag === "import") {
          convertElementToImportNode(root, paths, node);
        } else if (node.tag === "include") {
          convertElementToIncludeNode(root, paths, node);
        }
      }
    }
  };

  visit(createRootPath(root), visitor);
}
