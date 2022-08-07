type Value = string | number;

type Node = {
  type: string;
  props: Record<string, Value>;
  children: Node[];
};

export function parse(content: string): TXMLNode | undefined {
  return;
}
