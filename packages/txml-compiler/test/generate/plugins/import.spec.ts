import { describe, it, expect } from "vitest";
import { parse } from "../../../lib/parser";
import processImport from "../../../lib/generate/plugins/import";
import { NodeTypes, Node } from "../../../lib/parser/ast";

type TestCase = {
  name: string;
  input: string;
  output: Array<Node>;
};

describe("import plugin", () => {
  const testCases: Array<TestCase> = [
    {
      name: "import",
      input: `<import src="item.txml" />`,
      output: [
        {
          type: NodeTypes.IMPORT,
          src: "item.txml",
        },
      ],
    },
    {
      name: "import allow binding with constant",
      input: `<import src="{{"item.txml"}}" />`,
      output: [
        {
          type: NodeTypes.IMPORT,
          src: "item.txml",
        },
      ],
    },
    {
      name: "import skip attribute",
      input: `<import src="{{"item.txml"}}" att="value" />`,
      output: [
        {
          type: NodeTypes.IMPORT,
          src: "item.txml",
        },
      ],
    },
  ];

  testCases.forEach((tc) => {
    it(tc.name, () => {
      const root = parse(tc.input);
      processImport(root);
      expect(root.children).toEqual(tc.output);
    });
  });

  it("throws error if from is not end with .txml", () => {
    const root = parse(`<import src="./a" />`);
    expect(() => {
      processImport(root);
    }).toThrowError();
  });
});