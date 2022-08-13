import { Parser } from "../parser/grammar/parser";
import { DataProvider } from "./dataProvider";
import { Scanner } from "./scanner";

export function suggest(content: string): string[] {
  const parser = new Parser();
  const dp = new DataProvider();
  const scanner = new Scanner();
  parser.yy = {
    state: scanner,
  };
  try {
    parser.parse(content);
  } catch (err) {
    const text = (err as any).hash.text;
    const node = scanner.nodes.current();

    if (scanner.isWaitTagName()) {
      return dp.getTags(text);
    }
    if (scanner.isWaitTagNameClose()) {
      return node ? [node.tag] : [];
    }
    if (scanner.isWaitAttrName()) {
      if (!node) return [];
      return dp.getAttrNames(scanner.attrName || text, node.tag);
    }
    if (scanner.isWaitAttrValue()) {
      if (!node) return [];
      const attr = node.attrs[node.attrs.length - 1];
      if (attr === undefined) return [];
      return dp.getAttrsValues(text, node.tag, attr);
    }
  }
  return [];
}
