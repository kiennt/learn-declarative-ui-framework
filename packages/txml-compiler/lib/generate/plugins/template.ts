import {
  createSyntaxError,
  createTemplateDefinedNode,
  createTemplateInstanceNode,
  ElementNode,
  Expr,
  RootNode,
} from "../../parser/ast";
import { createRootPath, NodePath, replaceNode } from "../context";
import { getAttributeName, getStringValueForAttribute } from "../utils";
import { visit } from "../visitor";

function getDataExpr(node: ElementNode): Expr | undefined {
  const data = getAttributeName(node, "data");
  let expr;
  if (data) {
    if (data.value.length > 1) {
      throw createSyntaxError(node, "template data must be an expression");
    }
    expr = data.value[0].expr;
  }
  return expr;
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
          replaceNode(
            paths,
            createTemplateDefinedNode(name, node.children, dataExpr)
          );
          return;
        }

        replaceNode(
          paths,
          createTemplateInstanceNode(
            is.value.map((item) => item.expr),
            dataExpr
          )
        );
      },
    },
  };

  visit(createRootPath(root), visitor);
}
