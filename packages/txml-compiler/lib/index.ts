import { parse } from "./parser";
import { defaultPreset, genImport, genRender, transform } from "./transforms";

export { parse } from "./parser";
export { suggest } from "./suggestion";

let lastMark: number;
function mark(message: string) {
  const now = new Date().getTime();
  if (lastMark) {
    console.log(`${message} ${now - lastMark}ms`);
  } else {
    console.log(`${message}`);
  }
  lastMark = now;
}

export function compile(content: string): string {
  mark("start");
  const root = parse(content);
  mark("parse");
  transform(root, [...defaultPreset]);
  mark("transform");
  const importCode = genImport(root);
  mark("generate import code");
  const renderCode = genRender(root);
  mark("generate render code");
  return `
${importCode}
${renderCode}
  `;
}
