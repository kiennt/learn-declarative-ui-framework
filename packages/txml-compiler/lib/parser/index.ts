import * as ast from "./ast";
import { ElementNode } from "./ast";
import { Parser } from "./grammar/parser";

export function parse(content: string): Array<ElementNode> {
  const parser = new Parser();
  parser.yy = { ast };
  const nodes = parser.parse(content);

  return nodes;
}

function travarsal(node: ElementNode, visitor: Visitor): void {}
