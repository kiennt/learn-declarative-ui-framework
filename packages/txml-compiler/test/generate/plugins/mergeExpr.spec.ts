import { describe, it, expect } from "vitest";
import { parse } from "../../../lib/parser";
import processMergeExpr from "../../../lib/generate/plugins/mergeExpr";
import { ExprTypes, NodeTypes, Node } from "../../../lib/parser/ast";

type TestCase = {
  name: string;
  input: string;
  output: Array<Node>;
};

describe("mergeExpr plugin", () => {
  const testCases: Array<TestCase> = [
    {
      name: "element",
      input: `
        <view>
          hello {{a}}
          <view />
          {{b}} {{c}}
        </view>`,
      output: [
        {
          type: NodeTypes.ELEMENT,
          tag: "view",
          props: [],
          children: [
            {
              type: NodeTypes.INTERPOLATION,
              children: [
                {
                  type: ExprTypes.CONSTANT,
                  value: "hello ",
                },
                {
                  type: ExprTypes.VARIABLE,
                  value: "a",
                },
              ],
            },
            {
              type: NodeTypes.ELEMENT,
              tag: "view",
              props: [],
              children: [],
            },
            {
              type: NodeTypes.INTERPOLATION,
              children: [
                {
                  type: ExprTypes.VARIABLE,
                  value: "b",
                },
                {
                  type: ExprTypes.CONSTANT,
                  value: " ",
                },
                {
                  type: ExprTypes.VARIABLE,
                  value: "c",
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  testCases.forEach((tc) => {
    it(tc.name, () => {
      const root = parse(tc.input);
      processMergeExpr(root);
      expect(root.children).toEqual(tc.output);
    });
  });
});
