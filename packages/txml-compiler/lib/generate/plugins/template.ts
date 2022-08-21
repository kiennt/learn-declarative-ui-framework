import {
  ElementNode,
  Expr,
  RootNode,
  createSyntaxError,
  createTemplateDefinedNode,
  createTemplateInstanceNode
} from "../../parser/ast";
import { NodePath, createRootPath, replaceNode } from "../context";
import { getAttributeName, getStringValueForAttribute } from "../utils";
import { visit } from "../visitor";

function getDataExpr(node: ElementNode): Array<Expr> | undefined {
  const data = getAttributeName(node, "data");
  if (!data) return;
  return data.value.map(node => node.expr);
}

export default function plugin(root: RootNode): void {
  const visitor = {
    ElementNode: {
      exit(paths: NodePath) {
        const node = paths.node as ElementNode;
        if (node.tag !== "template") return;

        const is = getAttributeName(node, "is");
        const dataExpr = getDataExpr(node);

        // create template definition
        if (!is) {
          const name = getStringValueForAttribute(node, "name");
          if (!name) {
            throw createSyntaxError(node, "template must have name is string");
          }
          replaceNode(paths, createTemplateDefinedNode(name, node.children));
          return;
        }

        replaceNode(
          paths,
          createTemplateInstanceNode(
            is.value.map(item => item.expr),
            dataExpr
          )
        );
      }
    }
  };

  visit(createRootPath(root), visitor);
}
