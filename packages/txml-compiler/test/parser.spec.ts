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
        name: "tag with props and with children with many text",
        input: `<view class="blue">hello world</view>`,
        output: [
          {
            type: "NODE",
            tag: "view",
            props: {
              class: "blue",
            },
            children: ["hello", "world"],
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
    describe("constant", () => {
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
          input: '"hello"',
          output: "hello",
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
      ];
      testCases.forEach((tc) => {
        it(tc.name, () => {
          const nodes = parse(`<view>{{${tc.input}}}</view>`);
          const value = nodes[0].children[0];
          expect(value).toEqual({ type: "EXPR", expr: tc.output });
        });
      });
    });
  });
});
