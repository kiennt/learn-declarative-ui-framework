import { parse } from "../../../lib/parser";
import { ExprTypes, Node, NodeTypes } from "../../../lib/parser/ast";
import processIf from "../../../lib/transforms/plugins/if";
import { describe, expect, it } from "vitest";

type TestCase = {
  name: string;
  input: string;
  output: Array<Node>;
};

describe("if plugin", () => {
  const testCases: Array<TestCase> = [
    {
      name: "simple if",
      input: `<view tiki:if="{{a}}" />`,
      output: [
        {
          type: NodeTypes.IF,
          branches: [
            {
              type: NodeTypes.IF_BRANCH,
              content: {
                type: NodeTypes.ELEMENT,
                tag: "view",
                props: [],
                children: []
              },
              condition: {
                type: ExprTypes.VARIABLE,
                value: "a"
              }
            }
          ]
        }
      ]
    },
    {
      name: "if with props and children ",
      input: `
        <view tiki:if="{{a}}" attr1="value1">
          <button />
        </view>`,
      output: [
        {
          type: NodeTypes.IF,
          branches: [
            {
              type: NodeTypes.IF_BRANCH,
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
                          value: "value1"
                        }
                      }
                    ]
                  }
                ],
                children: [
                  {
                    type: NodeTypes.ELEMENT,
                    tag: "button",
                    props: [],
                    children: []
                  }
                ]
              },
              condition: {
                type: ExprTypes.VARIABLE,
                value: "a"
              }
            }
          ]
        }
      ]
    },
    {
      name: "if with else",
      input: `
        <view tiki:if="{{a}}" />
        <view tiki:else="" />`,
      output: [
        {
          type: NodeTypes.IF,
          branches: [
            {
              type: NodeTypes.IF_BRANCH,
              content: {
                type: NodeTypes.ELEMENT,
                tag: "view",
                props: [],
                children: []
              },
              condition: {
                type: ExprTypes.VARIABLE,
                value: "a"
              }
            },
            {
              type: NodeTypes.IF_BRANCH,
              content: {
                type: NodeTypes.ELEMENT,
                tag: "view",
                props: [],
                children: []
              }
            }
          ]
        }
      ]
    },
    {
      name: "if with elif",
      input: `
      <view tiki:if="{{a}}" />
      <view tiki:elif="{{b}}" />`,
      output: [
        {
          type: NodeTypes.IF,
          branches: [
            {
              type: NodeTypes.IF_BRANCH,
              content: {
                type: NodeTypes.ELEMENT,
                tag: "view",
                props: [],
                children: []
              },
              condition: {
                type: ExprTypes.VARIABLE,
                value: "a"
              }
            },
            {
              type: NodeTypes.IF_BRANCH,
              content: {
                type: NodeTypes.ELEMENT,
                tag: "view",
                props: [],
                children: []
              },
              condition: {
                type: ExprTypes.VARIABLE,
                value: "b"
              }
            }
          ]
        }
      ]
    },
    {
      name: "if with elif and else",
      input: `
      <view tiki:if="{{a}}" />
      <view tiki:elif="{{b}}" />
      <view tiki:else="" />`,
      output: [
        {
          type: NodeTypes.IF,
          branches: [
            {
              type: NodeTypes.IF_BRANCH,
              content: {
                type: NodeTypes.ELEMENT,
                tag: "view",
                props: [],
                children: []
              },
              condition: {
                type: ExprTypes.VARIABLE,
                value: "a"
              }
            },
            {
              type: NodeTypes.IF_BRANCH,
              content: {
                type: NodeTypes.ELEMENT,
                tag: "view",
                props: [],
                children: []
              },
              condition: {
                type: ExprTypes.VARIABLE,
                value: "b"
              }
            },
            {
              type: NodeTypes.IF_BRANCH,
              content: {
                type: NodeTypes.ELEMENT,
                tag: "view",
                props: [],
                children: []
              }
            }
          ]
        }
      ]
    }
  ];

  testCases.forEach(tc => {
    it(tc.name, () => {
      const root = parse(tc.input);
      processIf(root);
      expect(root.children).toEqual(tc.output);
    });
  });
});
