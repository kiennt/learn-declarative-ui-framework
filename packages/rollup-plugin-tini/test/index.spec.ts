import { rollup } from "rollup";
import { transform } from "@babel/standalone";
import type { Plugin } from "rollup";
import prettier from "prettier";
import { describe, it, expect } from "vitest";

type DataStore = Record<string, string>;

function babelReactTS(store: DataStore): Plugin {
  return {
    name: "tini",
    resolveId(id: string) {
      return { id };
    },
    load(id: string) {
      return store[id];
    },
    transform(code: string, filename: string) {
      let transformed = transform(code, {
        presets: ["react", ["typescript", { onlyRemoveTypeImports: true }]],
        filename: filename + ".tsx",
      });
      return transformed;
    },
  };
}

describe("plugin", () => {
  const testCases = [
    {
      name: "simple",
      input: `
type Person = {
  name: string;
  age: number;
};

function Counter(props: Person) {
  return <div>{props.name}: {props.age}</div>
}

render(<Counter />, document.getElementById("root"))
`,
      output: `
function Counter(props) {
  return /*#__PURE__*/ React.createElement(
    "div",
    null,
    props.name,
    ": ",
    props.age
  );
}

render(
  /*#__PURE__*/ React.createElement(Counter, null),
  document.getElementById("root")
);
`,
    },
  ];
  testCases.forEach((tc) => {
    it(tc.name, async () => {
      const store = {
        test: tc.input,
      };
      const compiler = await rollup({
        input: "test",
        plugins: [babelReactTS(store)],
      });
      const { output } = await compiler.generate({
        format: "esm",
        inlineDynamicImports: true,
      });
      const codeOutput: Array<string> = prettier
        .format(output[0].code)
        .split("\n");
      const expected: Array<string> = prettier.format(tc.output).split("\n");
      codeOutput.forEach((line, index) => {
        expect(expected[index]).toEqual(line);
      });
    });
  });
});
