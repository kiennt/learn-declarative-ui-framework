class Parser {
  constructor(content) {
    this.c = content;
    this.i = 0;
  }

  parseValue() {
    this.skipWhitespace();
    const value =
      this.parseNumber() ??
      this.parseString() ??
      this.parseObject() ??
      this.parseArray() ??
      this.parseBoolean() ??
      this.parseNull();
    this.skipWhitespace();
    return value;
  }

  skipWhitespace() {
    while (
      this.c[this.i] == " " ||
      this.c[this.i] == "\n" ||
      this.c[this.i] == "\t" ||
      this.c[this.i] == "\r"
    ) {
      this.i++;
    }
  }

  skipComma() {
    if (this.c[this.i] !== ",") {
      throw new Error('Expected ",".');
    }
    this.i++;
  }

  skipColon() {
    if (this.c[this.i] !== ":") {
      throw new Error('Expected ":".');
    }
    this.i++;
  }

  parseNumber() {
    let start = this.i;
    if (this.c[this.i] === "-") {
      this.i++;
    }
    if (this.c[this.i] === "0") {
      this.i++;
    } else if (this.c[this.i] >= "1" && this.c[this.i] <= "9") {
      this.i++;
      while (this.c[this.i] >= "0" && this.c[this.i] <= "9") {
        this.i++;
      }
    }
    if (this.c[this.i] === ".") {
      this.i++;
      while (this.c[this.i] >= "0" && this.c[this.i] <= "9") {
        this.i++;
      }
    }
    if (this.i > start) {
      return Number(this.c.slice(start, this.i));
    }
  }

  parseString() {
    if (this.c[this.i] !== '"') return;
    this.i++;
    let result = "";
    let isEndString = false;
    while (!isEndString) {
      result += this.c[this.i];
      this.i++;
      isEndString = this.c[this.i] === '"' && this.c[this.i - 1] !== "\\";
    }
    this.i++;
    return result;
  }

  parseBoolean() {
    return this.parseKeyword("true", true) || this.parseKeyword("false", false);
  }

  parseNull() {
    return this.parseKeyword("null", null);
  }

  parseKeyword(name, value) {
    if (this.c.slice(this.i, this.i + name.length) === name) {
      this.i += name.length;
      return value;
    }
  }

  parseObject() {
    if (this.c[this.i] !== "{") return;
    this.i++;
    this.skipWhitespace();
    const result = {};
    let initial = true;
    while (this.c[this.i] !== "}") {
      if (!initial) {
        this.skipComma();
        this.skipWhitespace();
      }

      const key = this.parseString();
      this.skipWhitespace();
      this.skipColon();
      this.skipWhitespace();
      const value = this.parseValue();
      result[key] = value;
      initial = false;
    }

    this.i++;
    return result;
  }

  parseArray() {
    if (this.c[this.i] !== "[") return;
    this.i++;
    this.skipWhitespace();
    const result = [];
    let initial = true;
    while (this.c[this.i] !== "]") {
      if (!initial) {
        this.skipComma();
      }

      const value = this.parseValue();
      result.push(value);
      initial = false;
    }

    this.i++;
    return result;
  }
}

export function parse(content) {
  return new Parser(content).parseValue();
}
