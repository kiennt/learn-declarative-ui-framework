type VNode = {
  type: string | Function;
  props: Record<string, any> & {
    children?: VNode[];
  };
};

export function h(
  type: string,
  props?: Record<string, any> | null,
  ...children: Array<VNode | string>
): VNode {
  // your code is in here
  // please visit test/h.spec.ts to understand more about the test cases
}
