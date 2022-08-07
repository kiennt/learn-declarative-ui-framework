import { Parser } from "./grammar/parser";

export function getAutoComplete(content: string, position: number): string[] {
  const parser = new Parser();
  try {
    parser.parse(content);
  } catch (err) {
    console.log("ahihi");
  }
  return [];
}
