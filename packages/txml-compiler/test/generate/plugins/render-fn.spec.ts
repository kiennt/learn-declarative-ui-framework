import { describe, it, expect } from "vitest";
import generateRenderFn from "../../../lib/generate/plugins/render-fn";
import { parse } from "../../../lib/parser";

describe("render function", () => {
  const testCases = [
    {
      name: "simple component",
      input: `<view>hello</view>`,
      output: `
function render(data)  {
  return <View>hello</View>
}`,
    },
    {
      name: "component with props",
      input: `<view a="b">hello</view>`,
      output: `
function render(data)  {
  return <View a="b">hello</View>
}`,
    },
    {
      name: "convert class props to className",
      input: `<view class="hello">hello</view>`,
      output: `
function render(data)  {
  return <View className="hello">hello</View>
}`,
    },
    {
      name: "native component with event listener",
      input: `<view onTap="onTap">hello</view>`,
      output: `
function render(data)  {
  return (<View onTap={$getEventHandler(this, "onTap")}>hello</View>);
}`,
    },
    {
      name: "custom component with event listener",
      input: `<my-component onTap="onTap" />`,
      output: `
function render(data)  {
  return (<MyComponent onTap={$getComponentEventHandler(this, "onTap")} $isCustomComponent={this.$isCustomComponent} __tag='my-component' />);
}`,
    },
    {
      name: "binding data in attribute and children",
      input: `<view attr="{{a}}">{{b}}</view>`,
      output: `
function render(data)  {
  return (<View attr={data['a']}>{data['b']}</View>);
}`,
    },
    {
      name: "if else elif",
      input: `
        <view key="value" t:if="{{a}}">a</view>
        <view key="value" t:elif="{{b}}">b</view>
        <view key="value" t:else="{{c}}">b</view>`,
      output: `
function render(data)  {
  return ({ 
    data['a'] 
    ? (<View>a</View>)
    : data['b'] ? (<View>b</View>)
    : (<View>c</View>)
  });
}`,
    },
    {
      name: "for",
      input: `<view t:for="{{list}}">{{index}} {{item}}</view>`,
      output: `
function render(data)  {
  return ({
    list.map((index, item) => {
      return ({index} {item});
    })
  });
}`,
    },
    {
      name: "for with custom index, custom item and binding data",
      input: `<view t:for="{{list}}" t:for-index="i" t:for-item="child">{{i}} {{child}} {{value}}</view>`,
      output: `
function render(data)  {
  return ({
    list.map((i, child) => {
      return ({i} {child} {data['value']});
    })
  });
}`,
    },
    {
      name: "block",
      input: `<block><view>hello</view></block>`,
      output: `
function render(data)  {
  return (<View>hello</View>);
}`,
    },
    {
      name: "block",
      input: `<block><view>hello</view></block>`,
      output: `
function render(data)  {
  return (<View>hello</View>);
}`,
    },
    {
      name: "slot",
      input: `
        <view>
          <slot><view>hello</view></slot>
          <slot name="scope"><view>scope</view></slot>
        </view>`,
      output: `
function render(data)  {
  return (
    <View>
      {renderSlot(data, "$default", <View>hello</View>)}
      {renderSlot(data, "scope", <View>scope</View>)}
    </View>
  );
}`,
    },
  ];

  testCases.forEach((tc) => {
    it(tc.name, () => {
      console.log(tc.input);
      const nodes = parse(tc.input);
      // expect(generateRenderFn(nodes)).toEqual(tc.output);
    });
  });
});
