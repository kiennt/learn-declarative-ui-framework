import { describe, it, expect, vi } from "vitest";
import { fireEvent, getByText } from "@testing-library/dom";
import { h, render } from "../lib/index";

const React = {
  createElement: h,
};

describe("render", () => {
  describe("render dom node", () => {
    it("render a simple vnode", () => {
      const container = document.createElement("div");
      render(<div>hello</div>, container);
      expect(container.innerHTML).toEqual(`<div>hello</div>`);
    });

    it("render a vnode with attribute", () => {
      const container = document.createElement("div");
      render(<div id="blue">hello</div>, container);
      expect(container.innerHTML).toEqual(`<div id="blue">hello</div>`);
    });

    it("render a vnode with event", () => {
      const container = document.createElement("div");
      const onClick = vi.fn();
      render(
        <div id="child" onClick={onClick}>
          hello
        </div>,
        container
      );
      expect(container.innerHTML).toEqual(`<div id="child">hello</div>`);
      fireEvent.click(getByText(container, "hello"));
      expect(onClick).toBeCalledTimes(1);
    });

    it("render a nested children", () => {
      const container = document.createElement("div");
      render(
        <div>
          <button>increase</button>
          <span>value</span>
          <button>decrease</button>
        </div>,
        container
      );
      expect(container.innerHTML).toEqual(
        `<div><button>increase</button><span>value</span><button>decrease</button></div>`
      );
    });
  });
});
