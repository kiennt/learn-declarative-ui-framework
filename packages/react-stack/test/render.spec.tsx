import { describe, it, beforeEach, expect, vi } from "vitest";
import { fireEvent, getByText } from "@testing-library/dom";
import { h, render, Component } from "../lib/index";

// we need to add this because when debugging,
// vscode does not load vitest.config.js
// @vitest-environment jsdom

// trick babel jsx plugin to use `h` instead of React.createElement
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

    it("render class component call componentDidMount", () => {
      const fn = vi.fn();
      class Counter extends Component {
        componentDidMount() {
          fn();
        }

        render() {
          return <div>{this.props.value}</div>;
        }
      }
      render(<Counter value={10} />, container);
      expect(container.innerHTML).toEqual(`<div>10</div>`);
      expect(fn).toBeCalledTimes(1);
    });

    it("render simple function component", () => {
      function Counter(props: any) {
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

  describe("update class component", () => {
    it("rerender when dom node change type", () => {
      class Counter extends Component<{}, { value: number }> {
        constructor(props: any) {
          super(props);
          this.state = {
            value: 0,
          };
        }

        onClick() {
          this.setState({
            value: this.state.value + 1,
          });
        }

        render() {
          return this.state.value === 0 ? (
            <div>
              <button id="button" onClick={this.onClick.bind(this)}>
                press
              </button>
            </div>
          ) : (
            <h1>hello</h1>
          );
        }
      }
      render(<Counter />, container);
      expect(container.innerHTML).toEqual(
        '<div><button id="button">press</button></div>'
      );
      fireEvent.click(getByText(container, "press"));
      expect(container.innerHTML).toEqual("<h1>hello</h1>");
    });

    it("rerender when update component node", () => {
      const fn1 = vi.fn();
      const fn2 = vi.fn();

      class Counter extends Component<any, any> {
        componentWillUnmount() {
          fn1();
        }
        componentDidUnmount() {
          fn2();
        }
        render() {
          return this.props.value === 0 ? (
            <button onClick={this.props.onClick}>
              press
              <Counter value={this.props.value - 1} />
            </button>
          ) : (
            <span>hello</span>
          );
        }
      }

      class App extends Component<{}, { value: number }> {
        constructor(props: any) {
          super(props);
          this.state = {
            value: 0,
          };
        }

        onClick() {
          this.setState({
            value: this.state.value + 1,
          });
        }
        render() {
          return (
            <Counter
              value={this.state.value}
              onClick={this.onClick.bind(this)}
            />
          );
        }
      }

      render(<App />, container);
      expect(container.innerHTML).toEqual(
        `<button>press<span>hello</span></button>`
      );
      fireEvent.click(getByText(container, "press"));
      expect(container.innerHTML).toEqual(`<span>hello</span>`);
      expect(fn1).toBeCalledTimes(2);
      expect(fn2).toBeCalledTimes(2);
    });

    it("rerender class component update child node", () => {
      class App extends Component<{}, { value: number }> {
        constructor(props: any) {
          super(props);
          this.state = {
            value: 0,
          };
        }

        onClick() {
          this.setState({
            value: this.state.value + 1,
          });
        }
        render() {
          const value = this.state.value;
          return (
            <button onClick={this.onClick.bind(this)}>
              press
              <span class={value > 0 ? "red" : "green"}>{value}</span>
              hello
            </button>
          );
        }
      }

      render(<App />, container);
      expect(container.innerHTML).toEqual(
        `<button>press<span class="green">0</span>hello</button>`
      );
      fireEvent.click(getByText(container, /press/));
      expect(container.innerHTML).toEqual(
        `<button>press<span class="red">1</span>hello</button>`
      );
    });
  });
});
