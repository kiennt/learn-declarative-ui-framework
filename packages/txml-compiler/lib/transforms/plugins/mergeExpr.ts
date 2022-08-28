import {
  BlockNode,
  ElementNode,
  ExprNode,
  Node,
  NodeTypes,
  RootNode,
  SlotNode,
  TemplateDefinitionNode,
  createInterpolationNode
} from "../../parser/ast";
import { NodePath, createRootPath } from "../context";
import { visit } from "../visitor";

function mergeExpr(children: Array<Node>) {
  if (children.length === 0) return;

  let currentExpr = [] as Array<ExprNode>;
  const doMergeExprs = () => {
    if (currentExpr.length > 0) {
      const exprSize = currentExpr.length;
      const newNode = createInterpolationNode(currentExpr);
      children.splice(i - exprSize, exprSize, newNode);
      i -= exprSize - 1;
      currentExpr = [];
    }
  };
  let i = 0;
  for (; i < children.length; i++) {
    const child = children[i];
    if (child.type === NodeTypes.EXPR) {
      currentExpr.push(child);
    } else {
      doMergeExprs();
    }
  }

  doMergeExprs();
}

export default function mergeExprPlugin(root: RootNode): void {
  const visitor = {
    ElementNode: {
      exit(paths: NodePath) {
        const node = paths.node as ElementNode;
        mergeExpr(node.children);
      }
    },

    BlockNode: {
      exit(paths: NodePath) {
        const node = paths.node as BlockNode;
        mergeExpr(node.children);
      }
    },

    TemplateDefinitionNode: {
      exit(paths: NodePath) {
        const node = paths.node as TemplateDefinitionNode;
        mergeExpr(node.content);
      }
    },

    SlotNode: {
      exit(paths: NodePath) {
        const node = paths.node as SlotNode;
        mergeExpr(node.content);
      }
    }
  };

  visit(createRootPath(root), visitor);
}
