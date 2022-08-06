type VNode = {
  type: string | Function;
  props: Record<string, any> & {
    children?: VNode[];
  };
};

const TEXT_NODE = "TEXT_NODE";

function isVNode(node: VNode | string): boolean {
  return typeof node === "object" && node.type !== undefined;
}

export function h(
  type: string,
  props?: Record<string, any> | null,
  ...children: Array<VNode | string>
): VNode {
  return {
    type,
    props: {
      ...(props || {}),
      children: children.map((child) => {
        if (isVNode(child)) return child as VNode;
        return {
          type: TEXT_NODE,
          props: {
            nodeValue: child,
          },
        };
      }),
    },
  };
}

function isDOMNode(vnode: VNode) {
  return typeof vnode.type === "string";
}

export function render(vnode: VNode, container: Element | Text): void {
  if (isDOMNode(vnode)) {
    return mountDOMNode(vnode, container);
  }
  mountComponentNode(vnode, container);
}

function mountDOMNode(vnode: VNode, container: Element | Text): void {
  // your turn to implement this function
  // please review render.spec.ts to understand more about the spec
}

function mountComponentNode(_vnode: VNode, _container: Element | Text): void {
  // we do not implement this function yet
}
