import { describe, it, expect } from "vitest";
import { getAutoComplete } from "../lib";

describe("auto complete", () => {
  const testCases = [
    // {
    //   input: "<|",
    //   output: ["view", "button"],
    // },
    // {
    //   input: "<v|",
    //   output: ["view"],
    // },
    // {
    //   input: "<view |",
    //   output: ["onTap", "class", "style"],
    // },
    {
      input: `<button class="blue"></|`,
      output: ["button>"],
    },
  ];

  // testCases.forEach((tc) => {
  //   it(tc.input, () => {
  //     const position = tc.input.indexOf("|");
  //     const content =
  //       tc.input.slice(0, position) + tc.input.slice(position + 1);
  //     expect(getAutoComplete(content, position)).toEqual(tc.output);
  //   });
  // });
});
