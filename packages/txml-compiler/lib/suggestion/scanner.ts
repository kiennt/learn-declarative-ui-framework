import { Stack } from "./stack";

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

export class Scanner {
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
