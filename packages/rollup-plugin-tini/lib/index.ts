import type { FilterPattern, DataToEsmOptions } from "@rollup/pluginutils";
import { createFilter, dataToEsm } from "@rollup/pluginutils";

type Options = {
  include?: FilterPattern;
  exclude?: FilterPattern;
} & DataToEsmOptions;

export default function PluginJson(options: Options = {}) {
  const filter = createFilter(options.include, options.exclude);
  const indent = options.indent !== undefined ? options.indent : "\t";

  return {
    name: "json",
    transform(code: string, id: string): any {
      if (!id.endsWith(".json") || !filter(id)) return null;

      try {
        const parsed = JSON.parse(code);
        return {
          code: dataToEsm(parsed, {
            preferConst: options.preferConst,
            compact: options.compact,
            namedExports: options.namedExports,
            indent,
          }),
          map: { mapping: "" },
        };
      } catch (err) {
        const message = "Could not parse JSON file";
        const errMessage = (err as Error).message as string;
        const matched = /[\d]/.exec(errMessage) || ["unknown"];
        const position = parseInt(matched[0], 10);
        (this as any).warn({ message, id, position });
        return null;
      }
    },
  };
}
