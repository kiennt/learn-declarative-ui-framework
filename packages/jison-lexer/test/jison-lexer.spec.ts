import JisonLex from "jison-lex";
import { describe, expect, it } from "vitest";

type Token = {
  type: string;
  value: string;
};

type TestCase = {
  name: string;
  input: string;
  output: Array<Token>;
};

describe("jison-lexer", () => {
  const grammar = {
    rules: [
      [
        '"',
        `
        if (yytext === '"') {
          return 'DQUOTE';
        } else {
          if (yytext.charAt(yyleng - 2) === '\\\\') {
            this.more()
          } else {
            this.unput('"');
            return 'STRING'; 
          }
        }
      `
      ],
      [
        "{{",
        `
      if (yytext === "{{")  {
        return '{{';
      } else {
        this.unput('{{');
        return 'STRING';
      }
      `
      ],
      [
        "{",
        `
        if (yytext.charAt(yyleng - 2) === "{") {
          this.unput("{{");
          return 'STRING';
        } else {
          this.more();
        }
        `
      ],
      ['[^"{]+', `this.more()`],
      ["$", "return 'EOF';"]
    ]
  };
  const lexer = new JisonLex(grammar);

  const testCases: Array<TestCase> = [
    {
      name: "simple",
      input: `"hello"`,
      output: [
        {
          type: "DQUOTE",
          value: '"'
        },
        {
          type: "STRING",
          value: "hello"
        },
        {
          type: "DQUOTE",
          value: '"'
        },
        {
          type: "EOF",
          value: ""
        }
      ]
    },
    {
      name: 'string with "',
      input: `"hello \\" very good \\" world"`,
      output: [
        {
          type: "DQUOTE",
          value: '"'
        },
        {
          type: "STRING",
          value: `hello \\" very good \\" world`
        },
        {
          type: "DQUOTE",
          value: '"'
        },
        {
          type: "EOF",
          value: ""
        }
      ]
    },
    {
      name: "string with {",
      input: `"hello { world"`,
      output: [
        {
          type: "DQUOTE",
          value: '"'
        },
        {
          type: "STRING",
          value: `hello { world`
        },
        {
          type: "DQUOTE",
          value: '"'
        },
        {
          type: "EOF",
          value: ""
        }
      ]
    },
    {
      name: "string with {{",
      input: `"hello {{"`,
      output: [
        {
          type: "DQUOTE",
          value: '"'
        },
        {
          type: "STRING",
          value: `hello `
        },
        {
          type: "{{",
          value: "{{"
        },
        {
          type: "DQUOTE",
          value: '"'
        },
        {
          type: "EOF",
          value: ""
        }
      ]
    },
    {
      name: "string with {{",
      input: `"hello { a { b { c {{ d {{"`,
      output: [
        {
          type: "DQUOTE",
          value: '"'
        },
        {
          type: "STRING",
          value: `hello { a { b { c `
        },
        {
          type: "{{",
          value: "{{"
        },
        {
          type: "STRING",
          value: " d "
        },
        {
          type: "{{",
          value: "{{"
        },
        {
          type: "DQUOTE",
          value: '"'
        },
        {
          type: "EOF",
          value: ""
        }
      ]
    }
  ];

  testCases.forEach(tc => {
    it(tc.name, () => {
      console.log(tc.name, tc.input);
      lexer.setInput(tc.input);
      const output = [];
      for (
        ;
        output[output.length - 1] === undefined ||
        output[output.length - 1].type !== "EOF";

      ) {
        const token = lexer.lex();
        output.push({ type: token, value: lexer.yytext });
      }
      expect(output).toEqual(tc.output);
    });
  });
});
