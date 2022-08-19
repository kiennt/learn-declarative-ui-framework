import { describe, it, expect } from "vitest";
import { parse } from "../../../lib/parser";
import processTemplate from "../../../lib/generate/plugins/template";
import {
  NodeTypes,
  Node,
  TemplateTypes,
  ExprTypes,
} from "../../../lib/parser/ast";

type TestCase = {
  name: string;
  input: string;
  output: Array<Node>;
};

describe("tempate plugin", () => {
  describe("define", () => {
    const testCases: Array<TestCase> = [
      {
        name: "simple",
        input: `<template name="hello">hello</template>`,
        output: [
          {
            type: NodeTypes.TEMPLATE,
            templateType: TemplateTypes.DEFINITION,
            name: "hello",
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
        name: "tempate with data",
        input: `<template name="hello" data="{{a}}">hello</template>`,
        output: [
          {
            type: NodeTypes.TEMPLATE,
            templateType: TemplateTypes.DEFINITION,
            name: "hello",
            data: {
              type: ExprTypes.VARIABLE,
              value: "a",
            },
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
    ];

    testCases.forEach((tc) => {
      it(tc.name, () => {
        const root = parse(tc.input);
        processTemplate(root);
        expect(root.children).toEqual(tc.output);
      });
    });

    it("throws error if name is not string", () => {
      const root = parse(`<template name="{{a}}">hello</template>`);
      expect(() => {
        processTemplate(root);
      }).toThrowError();
    });

    it("throws error if data is not single expression", () => {
      const root = parse(`<template data="hello-{{a}}">hello</template>`);
      expect(() => {
        processTemplate(root);
      }).toThrowError();
    });
  });

  describe("useage", () => {
    const testCases: Array<TestCase> = [
      {
        name: "simple",
        input: `<template is="hello" />`,
        output: [
          {
            type: NodeTypes.TEMPLATE,
            templateType: TemplateTypes.INSTANCE,
            is: [
              {
                type: ExprTypes.CONSTANT,
                value: "hello",
              },
            ],
          },
        ],
      },
      {
        name: "tempate with data",
        input: `<template is="hello" data="{{a}}" />`,
        output: [
          {
            type: NodeTypes.TEMPLATE,
            templateType: TemplateTypes.INSTANCE,
            data: {
              type: ExprTypes.VARIABLE,
              value: "a",
            },
            is: [
              {
                type: ExprTypes.CONSTANT,
                value: "hello",
              },
            ],
          },
        ],
      },
    ];

    testCases.forEach((tc) => {
      it(tc.name, () => {
        const root = parse(tc.input);
        processTemplate(root);
        expect(root.children).toEqual(tc.output);
      });
    });

    it("throws error if data is not single expression", () => {
      const root = parse(
        `<template is="hello" data="hello-{{a}}">hello</template>`
      );
      expect(() => {
        processTemplate(root);
      }).toThrowError();
    });
  });
});
