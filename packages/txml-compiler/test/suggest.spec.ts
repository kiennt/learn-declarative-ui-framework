import { describe, it, expect } from "vitest";
import { suggest } from "../lib";

describe.skip("auto complete", () => {
  const testCases = [
    {
      name: "suggest tag name",
      input: "<|",
      output: ["button", "view"],
    },
    {
      name: "suggest tag name with prefix",
      input: "<v|",
      output: ["view"],
    },
    {
      name: "suggest attribute",
      input: "<view |",
      output: ["class", "onTap", "style"],
    },
    {
      name: "suggest attribute with prefix",
      input: "<view cl|",
      output: ["class"],
    },
    {
      name: "suggest close tag",
      input: `<button class="blue"></|`,
      output: ["button"],
    },
    {
      name: "suggest open nested tag",
      input: `<button class="blue"><v|`,
      output: ["view"],
    },
    {
      name: "suggest close tag with nested",
      input: `<button class="blue"><view /></|`,
      output: ["button"],
    },
  ];

  testCases.forEach((tc) => {
    it(tc.name, () => {
      const position = tc.input.indexOf("|");
      const content =
        tc.input.slice(0, position) + tc.input.slice(position + 1);
      expect(suggest(content)).toEqual(tc.output);
    });
  });
});
