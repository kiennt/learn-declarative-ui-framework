import {
  ElementNode,
  Expr,
  IfBranchNode,
  RootNode,
  createIfBranchNode,
  createIfNode,
  createSyntaxError
} from "../../parser/ast";
import { NodePath, createRootPath, removeNode, replaceNode } from "../context";
import {
  getDiretiveName,
  hasDirectiveName,
  removeDirectiveName
} from "../utils";
import { visit } from "../visitor";

function checkAndGetExprForDirective(
  node: ElementNode,
  name: string,
  blacklist: Array<string>
): Expr | undefined {
  const dir = getDiretiveName(node, name);
  if (!dir) {
    return;
  }

  for (const item of blacklist) {
    if (hasDirectiveName(node, item)) {
      throw createSyntaxError(
        node,
        `element could not have both ${name} with ${item} directive`
      );
    }
  }

  if (dir.value.length > 1) {
    throw createSyntaxError(node, `invalid ${name} value`);
  }
  removeDirectiveName(node, name);
  return dir.value[0].expr;
}

export default function plugin(root: RootNode) {
  const visitor = {
    ElementNode: {
      exit(paths: NodePath) {
        const node = paths.node as ElementNode;
        const ifCondition = checkAndGetExprForDirective(node, "if", [
          "else",
          "elif"
        ]);
        if (!ifCondition) return;

        const deletedNodes = [];
        const branches = [] as Array<IfBranchNode>;
        branches.push(createIfBranchNode(node, ifCondition));

        if (paths.childIndex === undefined) return;
        const children = (paths.parent.node as any)[
          paths.key
        ] as Array<ElementNode>;

        for (
          let index = paths.childIndex + 1;
          index < children.length;
          index++
        ) {
          const next = children[index];
          let elifCondition = checkAndGetExprForDirective(next, "elif", [
            "if",
            "else"
          ]);
          if (elifCondition) {
            deletedNodes.push(next);
            branches.push(createIfBranchNode(next, elifCondition));
          }

          let elseCondition = checkAndGetExprForDirective(next, "else", [
            "if",
            "elif"
          ]);
          if (elseCondition) {
            deletedNodes.push(next);
            branches.push(createIfBranchNode(next));
            break;
          }
        }

        deletedNodes.forEach(item => removeNode(paths, item));
        replaceNode(paths, createIfNode(branches));
      }
    }
  };

  visit(createRootPath(root), visitor);
}
