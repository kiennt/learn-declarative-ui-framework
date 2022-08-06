import { describe, it, beforeEach, expect, vi } from "vitest";
import { fireEvent, getByText } from "@testing-library/dom";
import { h, render, Component } from "../lib/index";

// @vitest-environment jsdom

const React = {
  createElement: h,
};

describe("render", () => {
  let container: HTMLElement;
  beforeEach(() => {
    container = document.createElement("div");
  });

  describe("render dom node", () => {
    it("render a simple vnode", () => {
      render(<div>hello</div>, container);
      expect(container.innerHTML).toEqual(`<div>hello</div>`);
    });

    it("render a vnode with attribute", () => {
      render(<div id="blue">hello</div>, container);
      expect(container.innerHTML).toEqual(`<div id="blue">hello</div>`);
    });

    it("render a vnode with event", () => {
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

  describe("render component node", () => {
    it("render simple class component", () => {
      class Counter extends Component {
        render() {
          return <div>{this.props.value}</div>;
        }
      }
      render(<Counter value={10} />, container);
      expect(container.innerHTML).toEqual(`<div>10</div>`);
    });

    it("render simple function component", () => {
      function Counter(props) {
        return <div>{props.value}</div>;
      }
      render(<Counter value={10} />, container);
      expect(container.innerHTML).toEqual(`<div>10</div>`);
    });

    it("render complex component", () => {
      class Counter extends Component {
        render() {
          return <div>{this.props.value}</div>;
        }
      }

      function App() {
        return (
          <div id="child">
            <span>value is:</span>
            <Counter value={10} />
          </div>
        );
      }

      render(<App />, container);
      expect(container.innerHTML).toEqual(
        `<div id="child"><span>value is:</span><div>10</div></div>`
      );
    });
  });
});
