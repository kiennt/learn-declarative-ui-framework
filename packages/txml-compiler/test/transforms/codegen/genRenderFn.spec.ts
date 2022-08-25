import { parse } from "../../../lib/parser";
import { RootNode } from "../../../lib/parser/ast";
import { defaultPreset, transform } from "../../../lib/transforms";
import generateRenderFn, {
  R
} from "../../../lib/transforms/codegen/genRenderFn";
import prettier from "prettier";
import { describe, expect, it } from "vitest";

describe("render function", () => {
  const testCases = [
    {
      name: "simple component",
      input: `<view>hello</view>`,
      output: `
function render(data)  {
  return <View>{toString("hello")}</View>
}`
    },
    {
      name: "component with multiple text children",
      input: `<view>hello {{a}}</view>`,
      output: `
function render(data)  {
  return <View>{toString("hello ", data['a'])}</View>
}`
    },
    {
      name: "nested component",
      input: `<view><button>hello</button></view>`,
      output: `
function render(data)  {
  return <View><Button>{toString("hello")}</Button></View>
}`
    },
    {
      name: "nested component with mix text and node",
      input: `
<view>
  text1 {{a}}
  <button>node1</button>
  text2
  <button>node2</button>
  <button>node3</button>
</view>`,
      output: `
function render(data)  {
  return (
    <View>
      {toString("text1 ", data['a'])}
      <Button>{toString("node1")}</Button>
      {toString("text2")}
      <Button>{toString("node2")}</Button>
      <Button>{toString("node3")}</Button>
    </View>
  )
}`
    },
    {
      name: "component with props",
      input: `<view a="b">hello</view>`,
      output: `
function render(data)  {
  return <View a={"b"}>{toString("hello")}</View>
}`
    },
    {
      name: "component with props complex",
      input: `<view a="start {{a + b}} end">hello</view>`,
      output: `
function render(data)  {
  return (
    <View a={"start " + (data["a"] + data["b"]) + " end"}>
    {toString("hello")}
    </View>
  );
}`
    },
    {
      name: "convert class props to className",
      input: `<view class="hello">hello</view>`,
      output: `
function render(data)  {
  return <View className={"hello"}>{toString("hello")}</View>
}`
    },
    {
      name: "native component with event listener",
      input: `<view onTap="onTap">hello</view>`,
      output: `
function render(data)  {
  return (
    <View onTap={$getEventHandler(this, "onTap")}>
    {toString("hello")}
    </View>
  );
}`
    },
    {
      name: "native component with event listener is variable",
      input: `<view onTap="{{a + b}}">hello</view>`,
      output: `
function render(data)  {
  return (
    <View onTap={$getEventHandler(this, (data['a'] + data['b']))}>
    {toString("hello")}
    </View>
  );
}`
    },
    {
      name: "custom component with event listener",
      input: `<my-component onTap="onTap" />`,
      output: `
function render(data)  {
  return (
    <MyComponent onTap={$getComponentEventHandler(this, "onTap")} $isCustomComponent={this.$isCustomComponent} __tag='my-component' />
  );
}`
    },
    {
      name: "binding data in attribute and children",
      input: `<view attr="{{a}}">{{b}}</view>`,
      output: `
function render(data)  {
  return <View attr={data['a']}>{toString(data['b'])}</View>;
}`
    },
    {
      name: "block",
      input: `
<block>
  <view>hello</view>
</block>`,
      output: `
function render(data)  {
  return (
    <>
      <View>{toString("hello")}</View>
    </>
  );
}`
    },
    {
      name: "for",
      input: `<view tiki:for="{{list}}">{{index}} {{item}}</view>`,
      output: `
function render(data)  {
  return (
    <>
    {
      data['list'].map((item, index) => {
        return <View>{toString(index, " ", item)}</View>;
      })
    }
    </>
  );
}`
    },
    {
      name: "for with custom index, custom item and binding data",
      input: `
<view tiki:for="{{list}}" tiki:for-index="i" tiki:for-item="child">
  {{i}} {{child}} {{value}}
</view>`,
      output: `
function render(data)  {
  return (
    <>
    {
      data['list'].map((child, i) => {
        return <View>{toString(i, " ", child, " ", data['value'])}</View>;
      })
    }
    </>
  );
}`
    },
    {
      name: "if",
      input: `<view key="value" tiki:if="{{a + b}}">a</view>`,
      output: `
function render(data)  {
  return (
    <>
    {
      (data['a'] + data['b']) 
        ? (<View key={"value"}>{toString("a")}</View>) 
        : null
    }
    </>
  );
}`
    },
    {
      name: "if with multi children",
      input: `
      <view key="value" tiki:if="{{a + b}}">a</view>
      <view />
      `,
      output: `
function render(data)  {
  return (
    <>
    {
      (data['a'] + data['b']) 
        ? (<View key={"value"}>{toString("a")}</View>) 
        : null
    }
    <View />
    </>
  );

}`
    },
    {
      name: "if else",
      input: `
        <view key="value" tiki:if="{{a + b}}">a</view>
        <view key="value" tiki:else="">b</view>
      `,
      output: `
function render(data)  {
  return (
    <>
    {
      (data['a'] + data['b']) 
        ? (<View key={"value"}>{toString("a")}</View>) 
        : (<View key={"value"}>{toString("b")}</View>)
    }
    </>
  );
}`
    },
    {
      name: "if elif ",
      input: `
        <view key="value" tiki:if="{{a + b}}">a</view>
        <view key="value" tiki:elif="{{a}}">b</view>
      `,
      output: `
function render(data)  {
  return (
    <>
    {
      (data['a'] + data['b']) ? (<View key={"value"}>{toString("a")}</View>) 
        : (data['a']) ?  (<View key={"value"}>{toString("b")}</View>) 
        : null
    }
    </>
  );
}`
    },
    {
      name: "slot",
      input: `
<view>
  <slot><view>default slot</view></slot>
  <view attr="value">view</view>
  <slot name="named"><view>named slot</view></slot>
</view>`,
      output: `
function render(data)  {
  return (
    <View>
      {renderSlot(data, "$default", <><View>{toString("default slot")}</View></>)}
      <View attr={"value"}>{toString("view")}</View>
      {renderSlot(data, "named", <><View>{toString("named slot")}</View></>)}
    </View>
  );
}`
    }
  ];

  testCases.forEach(tc => {
    it(tc.name, () => {
      const root = parse(tc.input);
      transform(root, [...defaultPreset, generateRenderFn]);
      const codeOutput = (root as R<RootNode>).code;
      const output: Array<string> = prettier.format(codeOutput).split("\n");
      const expected: Array<string> = prettier.format(tc.output).split("\n");
      output.forEach((line, index) => {
        console.log(line);
        expect(expected[index]).toEqual(line);
      });
    });
  });
});
