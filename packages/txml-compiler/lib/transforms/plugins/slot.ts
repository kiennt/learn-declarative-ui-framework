import {
  ElementNode,
  Expr,
  ExprTypes,
  RootNode,
  createSlotNode
} from "../../parser/ast";
import { NodePath, createRootPath, replaceNode } from "../context";
import { getAttributeName } from "../utils";
import { visit } from "../visitor";

export default function slotPlugin(root: RootNode): void {
  const visitor = {
    ElementNode: {
      exit(paths: NodePath) {
        const node = paths.node as ElementNode;
        if (node.tag !== "slot") return;

        let name: Array<Expr> = [
          {
            type: ExprTypes.CONSTANT,
            value: "$default"
          }
        ];
        const attr = getAttributeName(node, "name");
        if (attr) {
          name = attr.value.map(item => item.expr);
        }
        replaceNode(paths, createSlotNode(node.children, name));
      }
    }
  };

  visit(createRootPath(root), visitor);
}
