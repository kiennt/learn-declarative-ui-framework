import type { Node, RootNode } from "../parser/ast";

export type NodePath =
  | {
      node: Node;
      parent: undefined;
      childIndex: undefined;
    }
  | {
      node: Node;
      parent: NodePath;
      /**
       * path from parent node to current node
       * e.g
       * if we have a parent node like this
       *  parent = {
       *    props: [{
       *      node1,
       *      node2
       *    }]
       *  }
       * then when visit node1, we will have
       *    + key = 'props'
       *    + childIndex = 0
       * and when visit node2, we will have
       *    + key = 'props'
       *    + childIndex = 1
       */
      key: string;
      childIndex?: number;
      onNodeRemoved?: () => void;
    };

export function createRootPath(node: RootNode): NodePath {
  return {
    node,
    parent: undefined,
    childIndex: undefined,
  };
}

export function createPath(
  parent: NodePath,
  key: string,
  node: Node,
  childIndex?: number,
  onNodeRemoved?: () => void
): NodePath {
  return {
    node,
    parent,
    key,
    childIndex,
    onNodeRemoved,
  };
}

/**
 * this function should only call on enter function
 * if this function is call on exit function, it will have error
 * @param path
 * @returns
 */
export function removeNode(path: NodePath, node: Node): void {
  // skip if this is root
  if (!path.parent) return;

  const parent = path.parent.node as any;
  // skip if this node is not in a list
  if (path.childIndex === undefined) return;

  const children = parent[path.key] as Array<Node>;
  let childIndex = 0;
  for (; childIndex < children.length; childIndex++) {
    if (children[childIndex] === node) {
      break;
    }
  }
  // could not found node in children
  if (childIndex === children.length) return;

  children.splice(childIndex, 1);
  if (path.onNodeRemoved && childIndex === path.childIndex)
    path.onNodeRemoved();
}

export function replaceNode(path: NodePath, newNode: Node): void {
  path.node = newNode;
  if (!path.parent) {
    return;
  }

  const parent = path.parent.node as any;
  if (path.childIndex === undefined) {
    parent[path.key] = newNode;
  } else {
    const children = parent[path.key] as Array<Node>;
    children[path.childIndex] = newNode;
  }
}
