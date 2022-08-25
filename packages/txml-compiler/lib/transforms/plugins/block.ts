import { ElementNode, RootNode, createBlockNode } from "../../parser/ast";
import { NodePath, createRootPath, replaceNode } from "../context";
import { visit } from "../visitor";

export default function plugin(root: RootNode): void {
  const visitor = {
    ElementNode: {
      exit(paths: NodePath) {
        const node = paths.node as ElementNode;
        if (node.tag !== "block") return;

        replaceNode(paths, createBlockNode(node.children));
      }
    }
  };

  visit(createRootPath(root), visitor);
}
