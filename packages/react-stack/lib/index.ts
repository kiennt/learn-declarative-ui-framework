type VNode = {
  type: string | Function;
  props: Record<string, any> & {
    children?: VNode[];
  };
};

type Instance = {
  render: () => VNode;
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

function isEventProp(value: string): Boolean {
  return value.startsWith("on");
}

function createDOMNode(type: string, props: VNode["props"]): Element | Text {
  if (type === TEXT_NODE) {
    return document.createTextNode(String(props.nodeValue));
  }

  let dom = document.createElement(type);
  Object.keys(props).forEach((key) => {
    // skip if key is children
    if (key === "children") return;

    const value = props[key];
    if (isEventProp(key)) {
      dom.addEventListener(key.slice(2).toLocaleLowerCase(), value);
    } else {
      dom.setAttribute(key, value);
    }
  });

  return dom;
}

function mountDOMNode(vnode: VNode, container: Element | Text): void {
  const dom = createDOMNode(vnode.type as string, vnode.props);
  container.appendChild(dom);
  const children = vnode.props.children;
  if (children) {
    children.forEach((child) => render(child, dom));
  }
}

function mountComponentNode(vnode: VNode, container: Element | Text): void {
  const instance = initiateComponent(vnode);
  const newVNode = instance.render();
  render(newVNode, container);
}

function isClassComponent(fn: Function) {
  return typeof fn === "function" && (fn as any).render !== undefined;
}

export class Component {
  // implement this code
}

function initiateComponent(vnode: VNode): Instance {
  let instance;
  if (isClassComponent(vnode.type as Function)) {
    // implement this code
  } else {
    // implement this code
  }

  return instance;
}
