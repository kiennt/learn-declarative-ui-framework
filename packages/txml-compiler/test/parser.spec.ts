import { describe, it, expect } from "vitest";
import { parse } from "../lib";

describe("parse", () => {
  describe("node", () => {
    const testCases = [
      {
        name: "tag without props and children",
        input: `<view></view>`,
        output: [
          {
            type: "NODE",
            tag: "view",
            props: {},
            children: [],
          },
        ],
      },
      {
        name: "tag without props and children self closed",
        input: `<view />`,
        output: [
          {
            type: "NODE",
            tag: "view",
            props: {},
            children: [],
          },
        ],
      },
      {
        name: "tag with props and without children",
        input: `<view class="blue"></view>`,
        output: [
          {
            type: "NODE",
            tag: "view",
            props: {
              class: "blue",
            },
            children: [],
          },
        ],
      },
      {
        name: "tag with props unicode",
        input: `<view message="đây là tiếng \\" việt nhé"></view>`,
        output: [
          {
            type: "NODE",
            tag: "view",
            props: {
              message: 'đây là tiếng \\" việt nhé',
            },
            children: [],
          },
        ],
      },
      {
        name: "tag with prop value has single quote in double quote",
        input: `<view message="đây là tiếng ' việt nhé"></view>`,
        output: [
          {
            type: "NODE",
            tag: "view",
            props: {
              message: "đây là tiếng ' việt nhé",
            },
            children: [],
          },
        ],
      },
      {
        name: "tag with props is directive",
        input: `<view tk:class="blue"></view>`,
        output: [
          {
            type: "NODE",
            tag: "view",
            props: {
              "tk:class": "blue",
            },
            children: [],
          },
        ],
      },
      {
        name: "tag with props and without children self closed",
        input: `<view class="blue" />`,
        output: [
          {
            type: "NODE",
            tag: "view",
            props: {
              class: "blue",
            },
            children: [],
          },
        ],
      },
      {
        name: "tag with props and with children text",
        input: `<view class="blue">hello</view>`,
        output: [
          {
            type: "NODE",
            tag: "view",
            props: {
              class: "blue",
            },
            children: ["hello"],
          },
        ],
      },
      {
        name: "tag with children unicode",
        input: `<view>một đoạn văn tiếng việt rất ngầu</view>`,
        output: [
          {
            type: "NODE",
            tag: "view",
            props: {},
            children: ["một đoạn văn tiếng việt rất ngầu"],
          },
        ],
      },
      {
        name: "tag with props and with children with many text",
        input: `<view class="blue">hello world</view>`,
        output: [
          {
            type: "NODE",
            tag: "view",
            props: {
              class: "blue",
            },
            children: ["hello world"],
          },
        ],
      },
      {
        name: "tag with props and with nested children",
        input: `<view class="blue">hello<span>world</span></view>`,
        output: [
          {
            type: "NODE",
            tag: "view",
            props: {
              class: "blue",
            },
            children: [
              "hello",
              {
                type: "NODE",
                tag: "span",
                props: {},
                children: ["world"],
              },
            ],
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

  describe("binding", () => {
    describe("constant and variables", () => {
      const testCases = [
        {
          name: "number",
          input: "10",
          output: 10,
        },
        {
          name: "negative number",
          input: "-10",
          output: -10,
        },
        {
          name: "float",
          input: "-10.2",
          output: -10.2,
        },
        {
          name: "string",
          input: '"xin chào các bạn nhé"',
          output: "xin chào các bạn nhé",
        },
        {
          name: "true",
          input: "true",
          output: true,
        },
        {
          name: "false",
          input: "false",
          output: false,
        },
        {
          name: "undefined",
          input: "undefined",
          output: undefined,
        },
        {
          name: "null",
          input: "null",
          output: null,
        },
        {
          name: "variable",
          input: "message",
          output: "message",
        },
      ];
      testCases.forEach((tc) => {
        it(tc.name, () => {
          const nodes = parse(`<view>{{${tc.input}}}</view>`);
          const value = nodes[0].children[0];
          expect(value).toEqual({ type: "EXPR", expr: tc.output });
        });
      });
    });

    describe("binding in attribute", () => {
      const testCases = [
        {
          name: "string is expr",
          input: `<view a="{{id}}" />`,
          output: { type: "EXPR", expr: "id" },
        },
        {
          name: "expr at beginning of string",
          input: `<view a="{{id}}-value" />`,
          output: [{ type: "EXPR", expr: "id" }, "-value"],
        },
        {
          name: "expr at the middle of string",
          input: `<view a="item-{{id}}-value" />`,
          output: ["item-", { type: "EXPR", expr: "id" }, "-value"],
        },
        {
          name: "expr at the end of string",
          input: `<view a="item-{{id}}" />`,
          output: ["item-", { type: "EXPR", expr: "id" }],
        },
      ];

      testCases.forEach((tc) => {
        it(tc.name, () => {
          const children = parse(tc.input)[0].props.a;
          expect(children).toEqual(tc.output);
        });
      });
    });

    describe("binding in children", () => {
      const testCases = [
        {
          name: "string is expr",
          input: `<view>{{id}}</view>`,
          output: [{ type: "EXPR", expr: "id" }],
        },
        {
          name: "expr at beginning of string",
          input: `<view>{{id}}-value</view>`,
          output: [{ type: "EXPR", expr: "id" }, "-value"],
        },
        {
          name: "expr at the middle of string",
          input: `<view>item-{{id}}-value</view>`,
          output: ["item-", { type: "EXPR", expr: "id" }, "-value"],
        },
        {
          name: "expr at the end of string",
          input: `<view>item-{{id}}</view>`,
          output: ["item-", { type: "EXPR", expr: "id" }],
        },
      ];

      testCases.forEach((tc) => {
        it(tc.name, () => {
          const children = parse(tc.input)[0].children;
          expect(children).toEqual(tc.output);
        });
      });
    });
  });
});
