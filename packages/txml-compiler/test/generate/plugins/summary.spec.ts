import { describe, it, expect } from "vitest";
import { parse } from "../../../lib/parser";
import summary from "../../../lib/generate/plugins/summary";

describe("summary", () => {
  const testCases = [
    {
      name: "simple component",
      input: "<view />",
      output: {
        components: ["view"],
        useIf: false,
        useFor: false,
        useSlot: false,
        useTemplate: false,
        useBlock: false,
      },
    },
    {
      name: "nested components",
      input: "<view><span /><button /></view>",
      output: {
        components: ["view", "span", "button"],
        useIf: false,
        useFor: false,
        useSlot: false,
        useTemplate: false,
        useBlock: false,
      },
    },
    {
      name: "duplicated component",
      input: "<view><span /><view /></view>",
      output: {
        components: ["view", "span"],
        useIf: false,
        useFor: false,
        useSlot: false,
        useTemplate: false,
        useBlock: false,
      },
    },
    {
      name: "use if",
      input: `<view tk:if="{{a}}" />`,
      output: {
        components: ["view"],
        useIf: true,
        useFor: false,
        useSlot: false,
        useTemplate: false,
        useBlock: false,
      },
    },
    {
      name: "use for",
      input: `<view tk:for="{{a}}" />`,
      output: {
        components: ["view"],
        useIf: false,
        useFor: true,
        useSlot: false,
        useTemplate: false,
        useBlock: false,
      },
    },
    {
      name: "use block",
      input: `<view><block /></view>`,
      output: {
        components: ["view"],
        useIf: false,
        useFor: false,
        useSlot: false,
        useTemplate: false,
        useBlock: true,
      },
    },
    {
      name: "use slot",
      input: `<view><slot /></view>`,
      output: {
        components: ["view"],
        useIf: false,
        useFor: false,
        useSlot: true,
        useTemplate: false,
        useBlock: false,
      },
    },
    {
      name: "use template",
      input: `<view><template /></view>`,
      output: {
        components: ["view"],
        useIf: false,
        useFor: false,
        useSlot: false,
        useTemplate: true,
        useBlock: false,
      },
    },
  ];

  testCases.forEach((tc) => {
    it(tc.name, () => {
      const nodes = parse(tc.input);
      const result = summary(nodes);
      expect(result.components).toEqual(tc.output.components);
      expect(result.useIf).toEqual(tc.output.useIf);
      expect(result.useFor).toEqual(tc.output.useFor);
      expect(result.useSlot).toEqual(tc.output.useSlot);
      expect(result.useTemplate).toEqual(tc.output.useTemplate);
      expect(result.useBlock).toEqual(tc.output.useBlock);
    });
  });
});
