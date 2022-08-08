import { Parser } from "./grammar/parser";

class Stack<T> {
  data: T[] = [];
  current(): T | undefined {
    return this.data.length > 0 ? this.data[this.data.length - 1] : undefined;
  }

  push(value: T): void {
    this.data.push(value);
  }

  pop(): T | undefined {
    if (this.data.length === 0) return;
    return this.data.pop();
  }
}

type Node = {
  tag: string;
  attrs: string[];
};

enum State {
  WAIT_BEGIN_TAG_OPEN = "begin_tag_open",
  WAIT_TAG_NAME = "tag_name",
  WAIT_ATTR_NAME = "attr_name",
  WAIT_ATTR_VALUE_OPEN_QUOTE = "attr_value_open_quote",
  WAIT_ATTR_VALUE = "attr_value",
  WAIT_TAG_NAME_IN_END_TAG = "tag_name_in_end_tag",
  WAIT_END_TAG_CLOSE = "end_tag_close",
}

class Scanner {
  nodes: Stack<Node> = new Stack();
  inExpr: boolean = false;
  state: State = State.WAIT_BEGIN_TAG_OPEN;
  attrName: string | undefined;

  constructor(public debug: Boolean = false) {}

  acceptToken(token: string, yytext: string): void {
    if (this.debug) {
      console.log("scanner accept token", {
        token,
        yytext,
        inExpr: this.inExpr,
        state: this.state,
        nodes: this.nodes.data,
      });
    }
    switch (token) {
      case "{{": {
        this.inExpr = true;
        break;
      }

      case "}}": {
        this.inExpr = false;
        break;
      }

      case "<": {
        if (this.state === State.WAIT_BEGIN_TAG_OPEN) {
          this.state = State.WAIT_TAG_NAME;
          this.nodes.push({ tag: "", attrs: [] });
        }
        break;
      }

      case ">": {
        if (!this.inExpr) {
          this.state = State.WAIT_BEGIN_TAG_OPEN;
        }
        break;
      }

      case "</": {
        this.state = State.WAIT_TAG_NAME_IN_END_TAG;
        break;
      }

      case "/>": {
        this.state = State.WAIT_BEGIN_TAG_OPEN;
        this.nodes.pop();
        break;
      }

      case "IDENT": {
        if (this.state === State.WAIT_TAG_NAME) {
          const node = this.nodes.current();
          if (node) {
            node.tag = yytext;
          }
          this.state = State.WAIT_ATTR_NAME;
        } else if (this.state === State.WAIT_ATTR_NAME) {
          this.attrName = yytext;
        }
        break;
      }

      case "=": {
        if (!this.inExpr && this.state === State.WAIT_ATTR_NAME) {
          this.state = State.WAIT_ATTR_VALUE_OPEN_QUOTE;
          const node = this.nodes.current();
          if (node && this.attrName) {
            node.attrs.push(this.attrName);
          }
          this.attrName = undefined;
        }
        break;
      }

      case "QUOTE": {
        if (!this.inExpr) {
          if (this.state === State.WAIT_ATTR_VALUE_OPEN_QUOTE) {
            this.state = State.WAIT_ATTR_VALUE;
          } else if (this.state == State.WAIT_ATTR_VALUE) {
            this.state = State.WAIT_ATTR_NAME;
          }
        }
        break;
      }
    }
    if (this.debug) console.log("new state", this.state);
  }

  isWaitTagName(): Boolean {
    return this.state === State.WAIT_TAG_NAME;
  }

  isWaitTagNameClose() {
    return this.state === State.WAIT_TAG_NAME_IN_END_TAG;
  }

  isWaitAttrName() {
    return this.state === State.WAIT_ATTR_NAME;
  }

  isWaitAttrValue() {
    return this.state === State.WAIT_ATTR_VALUE;
  }
}

const tags = [
  {
    name: "view",
    props: [
      {
        name: "class",
        values: [],
      },
      {
        name: "style",
        values: [],
      },
      {
        name: "onTap",
        values: [],
      },
    ],
  },
  {
    name: "button",
    props: [
      {
        name: "class",
        values: [],
      },
      {
        name: "style",
        values: [],
      },
      {
        name: "onTap",
        values: [],
      },
      {
        name: "click",
        values: [],
      },
    ],
  },
];

function suggestValues(prefix: string, arr: string[]): string[] {
  return arr.filter((item) => item.startsWith(prefix)).sort();
}

class DataProvider {
  getTags(text: string): string[] {
    return suggestValues(
      text,
      tags.map((item) => item.name)
    );
  }

  getAttrNames(text: string, tag: string): string[] {
    const item = tags.filter((child) => child.name === tag)[0];
    if (!item) return [];
    return suggestValues(
      text,
      item.props.map((item) => item.name)
    );
  }

  getAttrsValues(text: string, tag: string, name: string): string[] {
    const item = tags.filter((child) => child.name === tag)[0];
    if (!item) return [];
    const attr = item.props.filter((child) => child.name === name)[0];
    if (!attr) return [];
    return suggestValues(text, attr.values);
  }
}

export function suggest(content: string): string[] {
  const parser = new Parser();
  const dp = new DataProvider();
  const scanner = new Scanner();
  parser.yy = {
    state: scanner,
  };
  try {
    parser.parse(content);
  } catch (err) {
    const text = (err as any).hash.text;
    const node = scanner.nodes.current();

    if (scanner.isWaitTagName()) {
      return dp.getTags(text);
    }
    if (scanner.isWaitTagNameClose()) {
      return node ? [node.tag] : [];
    }
    if (scanner.isWaitAttrName()) {
      if (!node) return [];
      return dp.getAttrNames(scanner.attrName || text, node.tag);
    }
    if (scanner.isWaitAttrValue()) {
      if (!node) return [];
      const attr = node.attrs[node.attrs.length - 1];
      if (attr === undefined) return [];
      return dp.getAttrsValues(text, node.tag, attr);
    }
  }
  return [];
}

export function parse(content: string): any {
  const parser = new Parser();
  const scanner = new Scanner();
  parser.yy = {
    state: scanner,
  };
  return parser.parse(content);
}
