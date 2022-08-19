import { describe, it, expect } from "vitest";
import { parse } from "../../../lib/parser";
import processSlot from "../../../lib/generate/plugins/slot";
import { ExprTypes, NodeTypes, Node } from "../../../lib/parser/ast";

type TestCase = {
  name: string;
  input: string;
  output: Array<Node>;
};

describe("slot plugin", () => {
  const testCases: Array<TestCase> = [
    {
      name: "without name",
      input: `
        <slot>
          hello
        </slot>`,
      output: [
        {
          type: NodeTypes.SLOT,
          name: [
            {
              type: ExprTypes.CONSTANT,
              value: "$default",
            },
          ],
          content: [
            {
              type: NodeTypes.EXPR,
              expr: {
                type: ExprTypes.CONSTANT,
                value: "hello",
              },
            },
          ],
        },
      ],
    },
    {
      name: "with name",
      input: `
        <slot name="hello">
          hello
          <view />
        </slot>`,
      output: [
        {
          type: NodeTypes.SLOT,
          name: [
            {
              type: ExprTypes.CONSTANT,
              value: "hello",
            },
          ],
          content: [
            {
              type: NodeTypes.EXPR,
              expr: {
                type: ExprTypes.CONSTANT,
                value: "hello",
              },
            },
            {
              type: NodeTypes.ELEMENT,
              tag: "view",
              props: [],
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: "multiple child",
      input: `
        <slot>
          hello
          <view />
        </slot>`,
      output: [
        {
          type: NodeTypes.SLOT,
          name: [
            {
              type: ExprTypes.CONSTANT,
              value: "$default",
            },
          ],
          content: [
            {
              type: NodeTypes.EXPR,
              expr: {
                type: ExprTypes.CONSTANT,
                value: "hello",
              },
            },
            {
              type: NodeTypes.ELEMENT,
              tag: "view",
              props: [],
              children: [],
            },
          ],
        },
      ],
    },
  ];

  testCases.forEach((tc) => {
    it(tc.name, () => {
      const root = parse(tc.input);
      processSlot(root);
      expect(root.children).toEqual(tc.output);
    });
  });
});
