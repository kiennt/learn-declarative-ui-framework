import { RootNode } from "../parser/ast";
import processBlock from "./plugins/block";
import processFor from "./plugins/for";
import processIf from "./plugins/if";
import processImport from "./plugins/import";
import processImportSjs from "./plugins/importSjs";
import processInclude from "./plugins/include";
import processMergeExpr from "./plugins/mergeExpr";
import processSlot from "./plugins/slot";
import processTemplate from "./plugins/template";

export type Plugin = (root: RootNode) => void;

export const defaultPreset = [
  processMergeExpr,
  processImport,
  processInclude,
  processImportSjs,
  processSlot,
  processTemplate,
  processBlock,
  processFor,
  processIf
];

export function transform(
  root: RootNode,
  preset: Array<Plugin> = defaultPreset
): void {
  preset.forEach(fn => fn(root));
}
