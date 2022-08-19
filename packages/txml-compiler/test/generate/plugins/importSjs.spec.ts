import { describe, it, expect } from "vitest";
import { parse } from "../../../lib/parser";
import processImportSjs from "../../../lib/generate/plugins/importSjs";
import { NodeTypes, Node } from "../../../lib/parser/ast";

type TestCase = {
  name: string;
  input: string;
  output: Array<Node>;
};

describe("sjs-import plugin", () => {
  const testCases: Array<TestCase> = [
    {
      name: "simple",
      input: `<import-sjs name="m1" from="./index.sjs"/>`,
      output: [
        {
          type: NodeTypes.SJS_IMPORT,
          name: "m1",
          from: "./index.sjs",
        },
      ],
    },
    {
      name: "import-sjs allow binding with constant",
      input: `<import-sjs name="{{"m1"}}" from="./index.sjs"/>`,
      output: [
        {
          type: NodeTypes.SJS_IMPORT,
          name: "m1",
          from: "./index.sjs",
        },
      ],
    },
    {
      name: "import skip attribute",
      input: `<import-sjs name="{{"m1"}}" from="./index.sjs" attr="value" />`,
      output: [
        {
          type: NodeTypes.SJS_IMPORT,
          name: "m1",
          from: "./index.sjs",
        },
      ],
    },
  ];

  testCases.forEach((tc) => {
    it(tc.name, () => {
      const root = parse(tc.input);
      processImportSjs(root);
      expect(root.children).toEqual(tc.output);
    });
  });

  it("throws error if from is not end with .sjs", () => {
    const root = parse(`<import-sjs name="m1" from="./a" />`);
    expect(() => {
      processImportSjs(root);
    }).toThrowError();
  });
});
