import { E } from "vitest/dist/global-644546f7";

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
  // convert n1 to dom node
  if (isComponentNode(n1)) {
    const instance = (n1 as VNode)._instance;
    if (!instance) return;
    callInstanceLifeCycle(instance, "componentWillUnmount");
    patch(instance._vnode, n2);
    callInstanceLifeCycle(instance, "componentDidUnmount");
    return;
  }

  // convert n2 to dom node
  if (isComponentNode(n2)) {
    const instance = initiateComponent(n2 as VNode);
    instance._vnode = instance.render();
    patch(n1, instance._vnode);
    callInstanceLifeCycle(instance, "componentDidMount");
    return;
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

  n1 = n1 as VNode;
  n2 = n2 as VNode;
  // patch current dom node
  updateDOMAttributes(n1._dom as Element | Text, n2.props, n1.props);
  n2._dom = n1._dom;

  // patch children
  patchChildren(n1, n2 as VNode, n1._dom as Element | Text);
}

function unmount(vnode: VNode): void {
  if (isComponentNode(vnode)) {
    const instance = vnode._instance;
    if (!instance) return;
    callInstanceLifeCycle(instance, "componentWillUnmount");
    if (instance._vnode) {
      unmount(instance._vnode);
    }
    callInstanceLifeCycle(instance, "componentDidUnmount");
    return;
  }

  if (!vnode._dom) return;
  const parent = vnode._dom.parentNode;
  if (parent) {
    parent.removeChild(vnode._dom);
  }

  if (vnode.props.children) {
    vnode.props.children.forEach((child) => unmount(child));
  }
}

function updateDOMAttributes(
  dom: Element | Text,
  newProps: VNode["props"],
  oldProps: VNode["props"]
): void {
  // handle text node in a special case
  if (dom.nodeType === Node.TEXT_NODE) {
    const oldValue = oldProps.nodeValue;
    const newValue = newProps.nodeValue;
    if (oldValue !== newValue) {
      dom.nodeValue = newValue;
    }
    return;
  }

  // set new props
  Object.keys(newProps).forEach((key) => {
    if (key === "children") return;
    const newValue = newProps[key];
    const oldValue = oldProps[key];
    if (newValue === oldValue) return;
    if (isEventProp(key)) {
      const event = key.slice(2).toLocaleLowerCase();
      dom.removeEventListener(event, oldValue);
      dom.addEventListener(event, newValue);
    } else {
      (dom as Element).setAttribute(key, newValue);
    }
  });

  // delete old props
  Object.keys(oldProps).forEach((key) => {
    // skip children key
    if (key === "children") return;
    // skip if we already set it
    if (newProps[key] !== undefined) return;
    const value = oldProps[key];
    if (isEventProp(key)) {
      const event = key.slice(2).toLocaleLowerCase();
      (dom as Element).removeEventListener(event, value);
    } else {
      (dom as Element).removeAttribute(key);
    }
  });
}

function patchChildren(n1: VNode, n2: VNode, container: Element | Text): void {
  const oldChildren = n1.props.children || [];
  const newChildren = n2.props.children || [];
  const minLength = Math.min(oldChildren.length, newChildren.length);
  for (let i = 0; i < minLength; i++) {
    patch(oldChildren[i], newChildren[i]);
  }
  if (oldChildren.length > newChildren.length) {
    oldChildren.slice(minLength).forEach((child) => {
      unmount(child);
    });
  } else if (newChildren.length > oldChildren.length) {
    newChildren.slice(minLength).forEach((child) => {
      render(child, container);
    });
  }
}
