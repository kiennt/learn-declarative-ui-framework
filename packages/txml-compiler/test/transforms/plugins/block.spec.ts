import { parse } from "../../../lib/parser";
import { ExprTypes, Node, NodeTypes } from "../../../lib/parser/ast";
import processBlock from "../../../lib/transforms/plugins/block";
import { describe, expect, it } from "vitest";

type TestCase = {
  name: string;
  input: string;
  output: Array<Node>;
};

describe("block plugin", () => {
  const testCases: Array<TestCase> = [
    {
      name: "single child",
      input: `
        <block>
          hello
        </block>`,
      output: [
        {
          type: NodeTypes.BLOCK,
          children: [
            {
              type: NodeTypes.EXPR,
              expr: {
                type: ExprTypes.CONSTANT,
                value: "hello"
              }
            }
          ]
        }
      ]
    },
    {
      name: "multiple child",
      input: `
        <block>
          hello
          <view />
        </block>`,
      output: [
        {
          type: NodeTypes.BLOCK,
          children: [
            {
              type: NodeTypes.EXPR,
              expr: {
                type: ExprTypes.CONSTANT,
                value: "hello"
              }
            },
            {
              type: NodeTypes.ELEMENT,
              tag: "view",
              props: [],
              children: []
            }
          ]
        }
      ]
    }
  ];

  testCases.forEach(tc => {
    it(tc.name, () => {
      const root = parse(tc.input);
      processBlock(root);
      expect(root.children).toEqual(tc.output);
    });
  });
});
