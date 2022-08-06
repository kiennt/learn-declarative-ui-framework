type VNode = {
  type: string | Function;
  props: Record<string, any> & {
    children?: VNode[];
  };

  _instance?: Instance;
  _dom?: Element | Text;
};

type Instance = {
  render: () => VNode | undefined;
  _vnode: VNode | undefined;
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

export function render(
  vnode: VNode,
  container: Element | Text,
  sibling?: Element | Text
): void {
  if (isDOMNode(vnode)) {
    return mountDOMNode(vnode, container, sibling);
  }
  mountComponentNode(vnode, container, sibling);
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

function mountDOMNode(
  vnode: VNode,
  container: Element | Text,
  sibling?: Element | Text
): void {
  const dom = createDOMNode(vnode.type as string, vnode.props);
  vnode._dom = dom;
  if (!sibling) {
    container.appendChild(dom);
  } else {
    container.insertBefore(dom, sibling);
  }
  const children = vnode.props.children;
  if (children) {
    children.forEach((child) => render(child, dom));
  }
}

function mountComponentNode(
  vnode: VNode,
  container: Element | Text,
  sibling?: Element | Text
): void {
  const instance = initiateComponent(vnode);
  const newVNode = instance.render();
  instance._vnode = newVNode;
  if (!newVNode) return;
  render(newVNode, container);
  callInstanceLifeCycle(instance, "componentDidMount");
}

function callInstanceLifeCycle(
  instance: Instance,
  name: string,
  ...params: Array<any>
) {
  // skip if the life cycle is not defined
  if ((instance as any)[name] === undefined) return;
  (instance as any)[name].call(instance, ...params);
}

function isClassComponent(fn: Function) {
  return (
    typeof fn === "function" &&
    ((fn as any).render !== undefined || fn.prototype.render !== undefined)
  );
}

function initiateComponent(vnode: VNode): Instance {
  let instance;
  const fn = vnode.type as any;
  if (isClassComponent(vnode.type as Function)) {
    instance = new fn(vnode.props);
  } else {
    instance = {
      props: vnode.props,
      render() {
        return fn(this.props);
      },
    };
  }

  vnode._instance = instance;
  return instance;
}

export class Component<P, S> {
  props: P;
  state: S;
  _vnode: VNode | undefined;

  constructor(props: P) {
    this.props = props;
    this.state = undefined as any as S;
  }

  render(): VNode | undefined {
    return undefined;
  }

  setState(newState: S) {
    // ignore if state did not change
    if (this.state === newState) return;
    this.state = newState;
    rerenderInstance(this, this._vnode);
  }
}

function rerenderInstance(
  instance: Instance,
  oldVNode: VNode | undefined
): void {
  const newVNode = instance.render();
  patch(oldVNode, newVNode);
  instance._vnode = newVNode;
}

function isComponentNode(vnode: VNode | undefined): Boolean {
  return vnode !== undefined && typeof vnode.type === "function";
}

function patch(n1: VNode | undefined, n2: VNode | undefined): void {
  if (isComponentNode(n1)) {
    // your turn to implement this
  }
  if (isComponentNode(n2)) {
    // your turn to implement this
  }

  const isChangeType =
    (n1 === undefined && n1 !== n2) ||
    (n2 === undefined && n1 !== n2) ||
    (n1 as VNode).type !== (n2 as VNode).type;
  if (isChangeType) {
    const dom = (n1 as VNode)._dom as Element | Text;
    if (n2) render(n2, dom.parentNode as Element | Text, dom);
    if (n1) unmount(n1);
    return;
  }

  // we will do it in next lessons
}

function unmount(vnode: VNode): void {
  if (!vnode._dom) return;
  const parent = vnode._dom.parentNode;
  if (parent) {
    parent.removeChild(vnode._dom);
  }

  if (vnode.props.children) {
    vnode.props.children.forEach((child) => unmount(child));
  }
}
