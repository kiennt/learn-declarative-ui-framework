import { parse } from "../../../lib/parser";
import { ExprTypes, Node, NodeTypes } from "../../../lib/parser/ast";
import processFor from "../../../lib/transforms/plugins/for";
import { describe, expect, it } from "vitest";

type TestCase = {
  name: string;
  input: string;
  output: Array<Node>;
};

describe("for plugin", () => {
  const testCases: Array<TestCase> = [
    {
      name: "simple for",
      input: `<view tiki:for="{{[1]}}">hello</view>`,
      output: [
        {
          type: NodeTypes.FOR,
          data: {
            type: ExprTypes.ARRAY,
            children: [
              {
                type: ExprTypes.CONSTANT,
                value: 1
              }
            ]
          },
          itemName: "item",
          indexName: "index",
          content: {
            type: NodeTypes.ELEMENT,
            tag: "view",
            props: [],
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
        }
      ]
    },
    {
      name: "for with custom item and index",
      input: `
      <view 
        tiki:for="{{[1]}}" 
        tiki:for-item="child" 
        tiki:for-index="i"
        attr1="value"
      >hello</view>`,
      output: [
        {
          type: NodeTypes.FOR,
          data: {
            type: ExprTypes.ARRAY,
            children: [
              {
                type: ExprTypes.CONSTANT,
                value: 1
              }
            ]
          },
          itemName: "child",
          indexName: "i",
          content: {
            type: NodeTypes.ELEMENT,
            tag: "view",
            props: [
              {
                type: NodeTypes.ATTRIBUTE,
                name: "attr1",
                value: [
                  {
                    type: NodeTypes.EXPR,
                    expr: {
                      type: ExprTypes.CONSTANT,
                      value: "value"
                    }
                  }
                ]
              }
            ],
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
        }
      ]
    }
  ];

  testCases.forEach(tc => {
    it(tc.name, () => {
      const root = parse(tc.input);
      processFor(root);
      expect(root.children).toEqual(tc.output);
    });
  });
});
