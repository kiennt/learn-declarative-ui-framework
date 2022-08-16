import { describe, it, expect } from "vitest";
import { parse } from "../lib";
import {
  ArithmeticOpTypes,
  Expr,
  ElementNode,
  ExprNode,
  ExprTypes,
  NodeTypes,
  OneArgOpTypes,
  ConditionOpTypes,
} from "../lib/parser/ast";

function testExprInAttr(
  input: string,
  output: Array<ExprNode | ElementNode>
): void {
  const nodes = parse(`<view attr="${input}" />`);
  expect(nodes.length).toEqual(1);
  expect(nodes[0].props.length).toEqual(1);
  const attr = nodes[0].props[0];
  expect(attr.name).toEqual("attr");
  expect(attr.value).toEqual(output);
}

function testExprInChilden(
  input: string,
  output: Array<ExprNode | ElementNode>
): void {
  const nodes = parse(`<view>${input}</view>`);
  expect(nodes.length).toEqual(1);
  expect(nodes[0].children).toEqual(output);
}

function runTestCasesForExprInAttr(testCases: Array<TestCase>) {
  describe("attr", () => {
    testCases.forEach((tc) => {
      it(tc.name, () => {
        testExprInAttr(tc.input, tc.output);
      });
    });
  });
}

function runTestCasesForExprInChildren(testCases: Array<TestCase>) {
  describe("children", () => {
    testCases.forEach((tc) => {
      it(tc.name, () => {
        testExprInChilden(tc.input, tc.output);
      });
    });
  });
}

function runTestCasesForExpr(testCases: Array<TestCase>) {
  runTestCasesForExprInAttr(testCases);
  runTestCasesForExprInChildren(testCases);
}

type TestCase = {
  name: string;
  input: string;
  output: Array<ExprNode | ElementNode>;
};

describe("parse", () => {
  describe("node", () => {
    const testCases: Array<TestCase> = [
      {
        name: "tag without props and children",
        input: `<view></view>`,
        output: [
          {
            type: NodeTypes.ELEMENT,
            tag: "view",
            props: [],
            children: [],
          },
        ],
      },
      {
        name: "tag without props and children self closed",
        input: `<view />`,
        output: [
          {
            type: NodeTypes.ELEMENT,
            tag: "view",
            props: [],
            children: [],
          },
        ],
      },
      {
        name: "tag with props and without children",
        input: `<view class="blue"></view>`,
        output: [
          {
            type: NodeTypes.ELEMENT,
            tag: "view",
            props: [
              {
                type: NodeTypes.ATTRIBUTE,
                name: "class",
                value: [
                  {
                    type: NodeTypes.EXPR,
                    expr: {
                      type: ExprTypes.CONSTANT,
                      value: "blue",
                    },
                  },
                ],
              },
            ],
            children: [],
          },
        ],
      },
      {
        name: "tag with props unicode",
        input: `<view message="đây là tiếng \\" việt nhé"></view>`,
        output: [
          {
            type: NodeTypes.ELEMENT,
            tag: "view",
            props: [
              {
                type: NodeTypes.ATTRIBUTE,
                name: "message",
                value: [
                  {
                    type: NodeTypes.EXPR,
                    expr: {
                      type: ExprTypes.CONSTANT,
                      value: 'đây là tiếng \\" việt nhé',
                    },
                  },
                ],
              },
            ],
            children: [],
          },
        ],
      },
      {
        name: "tag with prop value has single quote in double quote",
        input: `<view message="đây là tiếng ' việt nhé"></view>`,
        output: [
          {
            type: NodeTypes.ELEMENT,
            tag: "view",
            props: [
              {
                type: NodeTypes.ATTRIBUTE,
                name: "message",
                value: [
                  {
                    type: NodeTypes.EXPR,
                    expr: {
                      type: ExprTypes.CONSTANT,
                      value: "đây là tiếng ' việt nhé",
                    },
                  },
                ],
              },
            ],
            children: [],
          },
        ],
      },
      {
        name: "tag with props is directive",
        input: `<view tk:class="blue"></view>`,
        output: [
          {
            type: NodeTypes.ELEMENT,
            tag: "view",
            props: [
              {
                type: NodeTypes.DIRECTIVE,
                prefix: "tk",
                name: "class",
                value: [
                  {
                    type: NodeTypes.EXPR,
                    expr: {
                      type: ExprTypes.CONSTANT,
                      value: "blue",
                    },
                  },
                ],
              },
            ],
            children: [],
          },
        ],
      },
      {
        name: "tag with props and without children self closed",
        input: `<view class="blue" />`,
        output: [
          {
            type: NodeTypes.ELEMENT,
            tag: "view",
            props: [
              {
                type: NodeTypes.ATTRIBUTE,
                name: "class",
                value: [
                  {
                    type: NodeTypes.EXPR,
                    expr: {
                      type: ExprTypes.CONSTANT,
                      value: "blue",
                    },
                  },
                ],
              },
            ],
            children: [],
          },
        ],
      },
      {
        name: "tag with props and with children text",
        input: `<view class="blue">hello</view>`,
        output: [
          {
            type: NodeTypes.ELEMENT,
            tag: "view",
            props: [
              {
                type: NodeTypes.ATTRIBUTE,
                name: "class",
                value: [
                  {
                    type: NodeTypes.EXPR,
                    expr: {
                      type: ExprTypes.CONSTANT,
                      value: "blue",
                    },
                  },
                ],
              },
            ],
            children: [
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
        name: "tag with children unicode",
        input: `<view>một đoạn văn tiếng việt rất ngầu</view>`,
        output: [
          {
            type: NodeTypes.ELEMENT,
            tag: "view",
            props: [],
            children: [
              {
                type: NodeTypes.EXPR,
                expr: {
                  type: ExprTypes.CONSTANT,
                  value: "một đoạn văn tiếng việt rất ngầu",
                },
              },
            ],
          },
        ],
      },
      {
        name: "tag with props and with children with many text",
        input: `<view class="blue">hello world</view>`,
        output: [
          {
            type: NodeTypes.ELEMENT,
            tag: "view",
            props: [
              {
                type: NodeTypes.ATTRIBUTE,
                name: "class",
                value: [
                  {
                    type: NodeTypes.EXPR,
                    expr: {
                      type: ExprTypes.CONSTANT,
                      value: "blue",
                    },
                  },
                ],
              },
            ],
            children: [
              {
                type: NodeTypes.EXPR,
                expr: {
                  type: ExprTypes.CONSTANT,
                  value: "hello world",
                },
              },
            ],
          },
        ],
      },
      {
        name: "tag with props and with nested children",
        input: `<view class="blue">hello<span>world</span></view>`,
        output: [
          {
            type: NodeTypes.ELEMENT,
            tag: "view",
            props: [
              {
                type: NodeTypes.ATTRIBUTE,
                name: "class",
                value: [
                  {
                    type: NodeTypes.EXPR,
                    expr: {
                      type: ExprTypes.CONSTANT,
                      value: "blue",
                    },
                  },
                ],
              },
            ],
            children: [
              {
                type: NodeTypes.EXPR,
                expr: {
                  type: ExprTypes.CONSTANT,
                  value: "hello",
                },
              },
              {
                type: NodeTypes.ELEMENT,
                tag: "span",
                props: [],
                children: [
                  {
                    type: NodeTypes.EXPR,
                    expr: {
                      type: ExprTypes.CONSTANT,
                      value: "world",
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        name: "skip comment",
        input: `<!-- <view class="blue">hello<span>world</span></view> --><view />`,
        output: [
          {
            type: NodeTypes.ELEMENT,
            tag: "view",
            props: [],
            children: [],
          },
        ],
      },
      {
        name: "multiple node",
        input: `
          <view>hello</view>
          <view></view>
          <view />`,
        output: [
          {
            type: NodeTypes.ELEMENT,
            tag: "view",
            props: [],
            children: [
              {
                type: NodeTypes.EXPR,
                expr: {
                  type: ExprTypes.CONSTANT,
                  value: "hello",
                },
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
            type: NodeTypes.ELEMENT,
            tag: "view",
            props: [],
            children: [],
          },
        ],
      },
    ];

    testCases.forEach((tc) => {
      it(tc.name, () => {
        expect(parse(tc.input)).toEqual(tc.output);
      });
    });
  });

  describe("throw errors", () => {
    const errorCases = [
      {
        name: "invalid closed tag",
        input: "<view></div>",
      },
      {
        name: "invalid closed tag with props",
        input: `<view a="b"></div>`,
      },
      {
        name: "invalid closed tag with children",
        input: `<view>hello</div>`,
      },
      {
        name: "invalid closed tag with props and children",
        input: `<view a="b">hello</div>`,
      },
    ];

    errorCases.forEach((tc) => {
      it(tc.name, () => {
        expect(() => {
          parse(tc.input);
        }).toThrow(Error);
      });
    });
  });

  describe("interpolation", () => {
    runTestCasesForExpr([
      {
        name: "string in expr",
        input: '{{"id1"}}',
        output: [
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.CONSTANT, value: "id1" },
          },
        ],
      },
      {
        name: "expr with multiple binding",
        input: "start {{a}} {{b}} end",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.CONSTANT, value: "start " },
          },
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.VARIABLE, value: "a" },
          },
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.CONSTANT, value: " " },
          },
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.VARIABLE, value: "b" },
          },
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.CONSTANT, value: " end" },
          },
        ],
      },
      {
        name: "expr at beginning of string",
        input: "{{id}} value",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.VARIABLE, value: "id" },
          },
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.CONSTANT, value: " value" },
          },
        ],
      },
      {
        name: "expr at the middle of string",
        input: "item {{id}} value",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.CONSTANT, value: "item " },
          },
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.VARIABLE, value: "id" },
          },
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.CONSTANT, value: " value" },
          },
        ],
      },
      {
        name: "expr at the end of string",
        input: "item {{id}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.CONSTANT, value: "item " },
          },
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.VARIABLE, value: "id" },
          },
        ],
      },
    ]);
  });

  describe("trim children", () => {
    runTestCasesForExprInChildren([
      {
        name: "trim left string if has a node before it",
        input: `
          hello`,
        output: [
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.CONSTANT, value: "hello" },
          },
        ],
      },
      {
        name: "trim right string if it has a node after it",
        input: `
        hello

        <view />`,
        output: [
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.CONSTANT, value: "hello" },
          },
          {
            type: NodeTypes.ELEMENT,
            tag: "view",
            children: [],
            props: [],
          },
        ],
      },
      {
        name: "trim right string if it follow by close tag",
        input: `hello
        `,
        output: [
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.CONSTANT, value: "hello" },
          },
        ],
      },
      {
        name: "trim string if it in the middle",
        input: `
        <button></button> 

        hello    
          
        <view />
        `,
        output: [
          {
            type: NodeTypes.ELEMENT,
            tag: "button",
            children: [],
            props: [],
          },
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.CONSTANT, value: "hello" },
          },
          {
            type: NodeTypes.ELEMENT,
            tag: "view",
            children: [],
            props: [],
          },
        ],
      },
      {
        name: "does not trim children if we meet variable",
        input: `hello   {{a}}  {{b}}`,
        output: [
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.CONSTANT, value: "hello   " },
          },
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.VARIABLE, value: "a" },
          },
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.CONSTANT, value: "  " },
          },
          {
            type: NodeTypes.EXPR,
            expr: { type: ExprTypes.VARIABLE, value: "b" },
          },
        ],
      },
    ]);
  });

  describe("simple expression", () => {
    const testCases: Array<{
      name: string;
      input: string;
      output: Expr;
    }> = [
      {
        name: "binding number",
        input: "{{10}}",
        output: {
          type: ExprTypes.CONSTANT,
          value: 10,
        },
      },
      {
        name: "binding negative number",
        input: "{{-10}}",
        output: {
          type: ExprTypes.CONSTANT,
          value: -10,
        },
      },
      {
        name: "binding float",
        input: "{{-10.2}}",
        output: {
          type: ExprTypes.CONSTANT,
          value: -10.2,
        },
      },
      {
        name: "binding unicode string",
        input: '{{"xin chào các bạn nhé"}}',
        output: {
          type: ExprTypes.CONSTANT,
          value: "xin chào các bạn nhé",
        },
      },
      {
        name: "binding true",
        input: "{{true}}",
        output: {
          type: ExprTypes.CONSTANT,
          value: true,
        },
      },
      {
        name: "binding false",
        input: "{{false}}",
        output: {
          type: ExprTypes.CONSTANT,
          value: false,
        },
      },
      {
        name: "binding undefined",
        input: "{{undefined}}",
        output: {
          type: ExprTypes.CONSTANT,
          value: undefined,
        },
      },
      {
        name: "binding null",
        input: "{{null}}",
        output: {
          type: ExprTypes.CONSTANT,
          value: null,
        },
      },
      {
        name: "binding variable",
        input: "{{message}}",
        output: {
          type: ExprTypes.VARIABLE,
          value: "message",
        },
      },
    ];

    describe("attribute", () => {
      testCases.forEach((tc) => {
        it(tc.name, () => {
          testExprInAttr(tc.input, [
            {
              type: NodeTypes.EXPR,
              expr: tc.output,
            },
          ]);
        });
      });
    });

    describe("attribute", () => {
      testCases.forEach((tc) => {
        it(tc.name, () => {
          testExprInChilden(tc.input, [
            {
              type: NodeTypes.EXPR,
              expr: tc.output,
            },
          ]);
        });
      });
    });
  });

  describe("arithmetic expression", () => {
    runTestCasesForExpr([
      {
        name: "simple +",
        input: "{{a + b}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.ARITHMETIC,
              op: ArithmeticOpTypes.ADD,
              left: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "b",
              },
            },
          },
        ],
      },
      {
        name: "simple -",
        input: "{{a-b}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.ARITHMETIC,
              op: ArithmeticOpTypes.SUBTRACT,
              left: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "b",
              },
            },
          },
        ],
      },
      {
        name: "simple *",
        input: "{{a*b}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.ARITHMETIC,
              op: ArithmeticOpTypes.MULTIPLE,
              left: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "b",
              },
            },
          },
        ],
      },
      {
        name: "simple /",
        input: "{{a/b}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.ARITHMETIC,
              op: ArithmeticOpTypes.DIVIDE,
              left: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "b",
              },
            },
          },
        ],
      },
      {
        name: "simple %",
        input: "{{a%b}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.ARITHMETIC,
              op: ArithmeticOpTypes.MODULE,
              left: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "b",
              },
            },
          },
        ],
      },
      {
        name: "simple **",
        input: "{{a**b}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.ARITHMETIC,
              op: ArithmeticOpTypes.POWER,
              left: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "b",
              },
            },
          },
        ],
      },
      {
        name: "order of + and -",
        input: "{{a1+a2-a3}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.ARITHMETIC,
              op: ArithmeticOpTypes.SUBTRACT,
              left: {
                type: ExprTypes.ARITHMETIC,
                op: ArithmeticOpTypes.ADD,
                left: {
                  type: ExprTypes.VARIABLE,
                  value: "a1",
                },
                right: {
                  type: ExprTypes.VARIABLE,
                  value: "a2",
                },
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "a3",
              },
            },
          },
        ],
      },
      {
        name: "order of * / % **",
        input: "{{a1*a2/a3%a4**a5}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.ARITHMETIC,
              op: ArithmeticOpTypes.POWER,
              left: {
                type: ExprTypes.ARITHMETIC,
                op: ArithmeticOpTypes.MODULE,
                left: {
                  type: ExprTypes.ARITHMETIC,
                  op: ArithmeticOpTypes.DIVIDE,
                  left: {
                    type: ExprTypes.ARITHMETIC,
                    op: ArithmeticOpTypes.MULTIPLE,
                    left: {
                      type: ExprTypes.VARIABLE,
                      value: "a1",
                    },
                    right: {
                      type: ExprTypes.VARIABLE,
                      value: "a2",
                    },
                  },
                  right: {
                    type: ExprTypes.VARIABLE,
                    value: "a3",
                  },
                },
                right: {
                  type: ExprTypes.VARIABLE,
                  value: "a4",
                },
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "a5",
              },
            },
          },
        ],
      },
      {
        name: "order of all operators",
        input: "{{a1+a2-a3*a4/a5%a6**a7}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.ARITHMETIC,
              op: ArithmeticOpTypes.SUBTRACT,
              left: {
                type: ExprTypes.ARITHMETIC,
                op: ArithmeticOpTypes.ADD,
                left: {
                  type: ExprTypes.VARIABLE,
                  value: "a1",
                },
                right: {
                  type: ExprTypes.VARIABLE,
                  value: "a2",
                },
              },
              right: {
                type: ExprTypes.ARITHMETIC,
                op: ArithmeticOpTypes.POWER,
                left: {
                  type: ExprTypes.ARITHMETIC,
                  op: ArithmeticOpTypes.MODULE,
                  left: {
                    type: ExprTypes.ARITHMETIC,
                    op: ArithmeticOpTypes.DIVIDE,
                    left: {
                      type: ExprTypes.ARITHMETIC,
                      op: ArithmeticOpTypes.MULTIPLE,
                      left: {
                        type: ExprTypes.VARIABLE,
                        value: "a3",
                      },
                      right: {
                        type: ExprTypes.VARIABLE,
                        value: "a4",
                      },
                    },
                    right: {
                      type: ExprTypes.VARIABLE,
                      value: "a5",
                    },
                  },
                  right: {
                    type: ExprTypes.VARIABLE,
                    value: "a6",
                  },
                },
                right: {
                  type: ExprTypes.VARIABLE,
                  value: "a7",
                },
              },
            },
          },
        ],
      },
      {
        name: "using ( ) to change order",
        input: "{{(a1+a2)*a3}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.ARITHMETIC,
              op: ArithmeticOpTypes.MULTIPLE,
              left: {
                type: ExprTypes.ARITHMETIC,
                op: ArithmeticOpTypes.ADD,
                left: {
                  type: ExprTypes.VARIABLE,
                  value: "a1",
                },
                right: {
                  type: ExprTypes.VARIABLE,
                  value: "a2",
                },
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "a3",
              },
            },
          },
        ],
      },
    ]);
  });

  describe("one arg expression", () => {
    runTestCasesForExpr([
      {
        name: "minus expr",
        input: "{{-a}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.ONE_ARG,
              op: OneArgOpTypes.MINUS,
              expr: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
            },
          },
        ],
      },
      {
        name: "minus complex expr",
        input: "{{-a+-b}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.ARITHMETIC,
              op: ArithmeticOpTypes.ADD,
              left: {
                type: ExprTypes.ONE_ARG,
                op: OneArgOpTypes.MINUS,
                expr: {
                  type: ExprTypes.VARIABLE,
                  value: "a",
                },
              },
              right: {
                type: ExprTypes.ONE_ARG,
                op: OneArgOpTypes.MINUS,
                expr: {
                  type: ExprTypes.VARIABLE,
                  value: "b",
                },
              },
            },
          },
        ],
      },
      {
        name: "not expr",
        input: "{{!a}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.ONE_ARG,
              op: OneArgOpTypes.NOT,
              expr: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
            },
          },
        ],
      },
    ]);
  });

  describe("condition expression", () => {
    runTestCasesForExpr([
      {
        name: "deep equal",
        input: "{{a === b}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.CONDITION,
              op: ConditionOpTypes.DEEP_EQUAL,
              left: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "b",
              },
            },
          },
        ],
      },
      {
        name: "equal",
        input: "{{a == b}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.CONDITION,
              op: ConditionOpTypes.EQUAL,
              left: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "b",
              },
            },
          },
        ],
      },
      {
        name: "deep not equal",
        input: "{{a !== b}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.CONDITION,
              op: ConditionOpTypes.DEEP_NOT_EQUAL,
              left: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "b",
              },
            },
          },
        ],
      },
      {
        name: "not equal",
        input: "{{a != b}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.CONDITION,
              op: ConditionOpTypes.NOT_EQUAL,
              left: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "b",
              },
            },
          },
        ],
      },
      {
        name: "greater than or equal",
        input: "{{a >= b}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.CONDITION,
              op: ConditionOpTypes.GREATER_THAN_EQUAL,
              left: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "b",
              },
            },
          },
        ],
      },
      {
        name: "greater",
        input: "{{a > b}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.CONDITION,
              op: ConditionOpTypes.GREATER_THAN,
              left: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "b",
              },
            },
          },
        ],
      },
      {
        name: "less than equal",
        input: "{{a <= b}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.CONDITION,
              op: ConditionOpTypes.LESS_THAN_EQUAL,
              left: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "b",
              },
            },
          },
        ],
      },
      {
        name: "less than",
        input: "{{a < b}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.CONDITION,
              op: ConditionOpTypes.LESS_THAN,
              left: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "b",
              },
            },
          },
        ],
      },
      {
        name: "and ",
        input: "{{a && b}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.CONDITION,
              op: ConditionOpTypes.AND,
              left: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "b",
              },
            },
          },
        ],
      },
      {
        name: "or",
        input: "{{a || b}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.CONDITION,
              op: ConditionOpTypes.OR,
              left: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              right: {
                type: ExprTypes.VARIABLE,
                value: "b",
              },
            },
          },
        ],
      },
    ]);
  });

  describe("object access expression", () => {
    runTestCasesForExpr([
      {
        name: "simple expr",
        input: "{{a.b.c.d.e.f}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.OBJECT_ACCESS,
              expr: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              paths: ["b", "c", "d", "e", "f"],
            },
          },
        ],
      },
      {
        name: "complex expr",
        input: "{{(a + b).length}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.OBJECT_ACCESS,
              expr: {
                type: ExprTypes.ARITHMETIC,
                op: ArithmeticOpTypes.ADD,
                left: {
                  type: ExprTypes.VARIABLE,
                  value: "a",
                },
                right: {
                  type: ExprTypes.VARIABLE,
                  value: "b",
                },
              },
              paths: ["length"],
            },
          },
        ],
      },
    ]);
  });

  describe("tenary expression", () => {
    runTestCasesForExpr([
      {
        name: "simple",
        input: "{{ a ? b : c }}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.TENARY,
              condition: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              success: {
                type: ExprTypes.VARIABLE,
                value: "b",
              },
              fail: {
                type: ExprTypes.VARIABLE,
                value: "c",
              },
            },
          },
        ],
      },
      {
        name: "simple",
        input: "{{ a >= b ? c + 3 : d }}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.TENARY,
              condition: {
                type: ExprTypes.CONDITION,
                op: ConditionOpTypes.GREATER_THAN_EQUAL,
                left: {
                  type: ExprTypes.VARIABLE,
                  value: "a",
                },
                right: {
                  type: ExprTypes.VARIABLE,
                  value: "b",
                },
              },
              success: {
                type: ExprTypes.ARITHMETIC,
                op: ArithmeticOpTypes.ADD,
                left: {
                  type: ExprTypes.VARIABLE,
                  value: "c",
                },
                right: {
                  type: ExprTypes.CONSTANT,
                  value: 3,
                },
              },
              fail: {
                type: ExprTypes.VARIABLE,
                value: "d",
              },
            },
          },
        ],
      },
    ]);
  });

  describe("array expression", () => {
    runTestCasesForExpr([
      {
        name: "empty array",
        input: "{{[]}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.ARRAY,
              children: [],
            },
          },
        ],
      },
      {
        name: "array with different type",
        input: "{{[1, null, a, b + c]}}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.ARRAY,
              children: [
                {
                  type: ExprTypes.CONSTANT,
                  value: 1,
                },
                {
                  type: ExprTypes.CONSTANT,
                  value: null,
                },
                {
                  type: ExprTypes.VARIABLE,
                  value: "a",
                },
                {
                  type: ExprTypes.ARITHMETIC,
                  op: ArithmeticOpTypes.ADD,
                  left: {
                    type: ExprTypes.VARIABLE,
                    value: "b",
                  },
                  right: {
                    type: ExprTypes.VARIABLE,
                    value: "c",
                  },
                },
              ],
            },
          },
        ],
      },
    ]);
  });

  describe("object expression", () => {
    runTestCasesForExpr([
      {
        name: "object with key",
        input: "{{ a: 10 }}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.OBJECT,
              destructuringList: [],
              props: [
                {
                  key: "a",
                  value: {
                    type: ExprTypes.CONSTANT,
                    value: 10,
                  },
                },
              ],
            },
          },
        ],
      },
      {
        name: "object with key and destructuring",
        input: "{{a: 10, ...b, ...c, ...{a: 10, b:20} }}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.OBJECT,
              destructuringList: [
                {
                  type: ExprTypes.VARIABLE,
                  value: "b",
                },
                {
                  type: ExprTypes.VARIABLE,
                  value: "c",
                },
                {
                  type: ExprTypes.OBJECT,
                  destructuringList: [],
                  props: [
                    {
                      key: "a",
                      value: {
                        type: ExprTypes.CONSTANT,
                        value: 10,
                      },
                    },
                    {
                      key: "b",
                      value: {
                        type: ExprTypes.CONSTANT,
                        value: 20,
                      },
                    },
                  ],
                },
              ],
              props: [
                {
                  key: "a",
                  value: {
                    type: ExprTypes.CONSTANT,
                    value: 10,
                  },
                },
              ],
            },
          },
        ],
      },
    ]);
  });

  describe("function call expression", () => {
    runTestCasesForExpr([
      {
        name: "variable",
        input: "{{ a(10) }}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.FUNCTION_CALL,
              fn: {
                type: ExprTypes.VARIABLE,
                value: "a",
              },
              params: [
                {
                  type: ExprTypes.CONSTANT,
                  value: 10,
                },
              ],
            },
          },
        ],
      },
      {
        name: "object access",
        input: "{{ a.b.c.d(10) }}",
        output: [
          {
            type: NodeTypes.EXPR,
            expr: {
              type: ExprTypes.FUNCTION_CALL,
              fn: {
                type: ExprTypes.OBJECT_ACCESS,
                expr: {
                  type: ExprTypes.VARIABLE,
                  value: "a",
                },
                paths: ["b", "c", "d"],
              },
              params: [
                {
                  type: ExprTypes.CONSTANT,
                  value: 10,
                },
              ],
            },
          },
        ],
      },
    ]);
  });
});
