import * as ast from "./ast";
import { ElementNode } from "./ast";
import { Parser } from "./grammar/parser";

export function parse(content: string): Array<ElementNode> {
  const parser = new Parser();
  parser.yy = { ast };
  return parser.parse(content);
}
