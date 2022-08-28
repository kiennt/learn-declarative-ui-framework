import { parse } from "./parser";
import { defaultPreset, genImport, genRender, transform } from "./transforms";

export { parse } from "./parser";
export { suggest } from "./suggestion";

export function compile(content: string): string {
  const root = parse(content);
  transform(root, [...defaultPreset]);
  const importCode = genImport(root);
  const renderCode = genRender(root);
  return `
${importCode}
${renderCode}
  `;
}
