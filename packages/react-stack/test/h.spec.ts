import { describe, it, expect } from "vitest";
import { h } from "../lib/index";

describe("h", () => {
  it("should create element without props", () => {
    expect(h("div")).toEqual({
      type: "div",
      props: {
        children: [],
      },
    });
  });

  it("shoud create element with props", () => {
    expect(h("div", { class: "name" })).toEqual({
      type: "div",
      props: {
        class: "name",
        children: [],
      },
    });
  });

  it("should create element with props and text children", () => {
    expect(h("div", { class: "name" }, "hello")).toEqual({
      type: "div",
      props: {
        class: "name",
        children: [
          {
            type: "TEXT_NODE",
            props: {
              nodeValue: "hello",
            },
          },
        ],
      },
    });
  });

  it("should create element with props and nested children", () => {
    expect(h("div", { class: "name" }, h("span", null, "hello"))).toEqual({
      type: "div",
      props: {
        class: "name",
        children: [
          {
            type: "span",
            props: {
              children: [
                {
                  type: "TEXT_NODE",
                  props: {
                    nodeValue: "hello",
                  },
                },
              ],
            },
          },
        ],
      },
    });
  });
});
