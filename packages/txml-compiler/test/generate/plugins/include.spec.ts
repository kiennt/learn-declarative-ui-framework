import { describe, it, expect } from "vitest";
import { parse } from "../../../lib/parser";
import processInclude from "../../../lib/generate/plugins/include";
import { NodeTypes, Node } from "../../../lib/parser/ast";

type TestCase = {
  name: string;
  input: string;
  output: Array<Node>;
};

describe("include plugin", () => {
  const testCases: Array<TestCase> = [
    {
      name: "simple",
      input: `<include src="item.txml" />`,
      output: [
        {
          type: NodeTypes.INCLUDE,
          src: "item.txml",
        },
      ],
    },
    {
      name: "include allow binding with constant",
      input: `<include src="{{"item.txml"}}" />`,
      output: [
        {
          type: NodeTypes.INCLUDE,
          src: "item.txml",
        },
      ],
    },
    {
      name: "include skip attribute",
      input: `<include src="{{"item.txml"}}" attr="value" />`,
      output: [
        {
          type: NodeTypes.INCLUDE,
          src: "item.txml",
        },
      ],
    },
  ];

  testCases.forEach((tc) => {
    it(tc.name, () => {
      const root = parse(tc.input);
      processInclude(root);
      expect(root.children).toEqual(tc.output);
    });
  });

  it("throws error if src is not end with .txml", () => {
    const root = parse(`<include src="./a" />`);
    expect(() => {
      processInclude(root);
    }).toThrowError();
  });
});