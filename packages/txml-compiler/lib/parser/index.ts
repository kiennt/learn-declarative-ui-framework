import * as ast from "./ast";
import { Parser } from "./grammar/parser";

export function parse(content: string): ast.RootNode {
  const parser = new Parser();
  parser.yy = { ast };
  console.log("parse txml content", content);
  return parser.parse(content);
}
