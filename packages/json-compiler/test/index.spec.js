import { describe, it, expect } from "vitest";
import { parse as jisonParse } from "./src/grammar/parser";
import { parse as handParse } from "./src/index";

[
  {
    fn: jisonParse,
    name: "jison parse",
  },
  {
    fn: handParse,
    name: "our parse",
  },
].forEach((item) => {
  const parse = item.fn;
  describe(item.name, () => {
    const testCases = [
      {
        name: "parse string",
        input: '"hello"',
        output: "hello",
      },
      {
        name: "parse number",
        input: "10",
        output: 10,
      },
      {
        name: "parse boolean true",
        input: "true",
        output: true,
      },
      {
        name: "parse boolean false",
        input: "false",
        output: false,
      },
      {
        name: "parse null value",
        input: "null",
        output: null,
      },
      {
        name: "parse object",
        input: '{"key1": "value1", "key2": "value2", "key3": {"a": "b"}}',
        output: {
          key1: "value1",
          key2: "value2",
          key3: { a: "b" },
        },
      },
      {
        name: "parse array",
        input:
          '{"key1": "value1", "key2": "value2", "key3": [{"a": "b"}, 10, "hello"]}',
        output: {
          key1: "value1",
          key2: "value2",
          key3: [{ a: "b" }, 10, "hello"],
        },
      },
    ];
    testCases.forEach((tc) => {
      it(tc.name, () => {
        expect(parse(tc.input)).toEqual(tc.output);
      });
    });

    // it("throws error", () => {
    //   expect(() => {
    //     parse("{a: 10}");
    //   }).toThrow(Error);
    // });
  });
});