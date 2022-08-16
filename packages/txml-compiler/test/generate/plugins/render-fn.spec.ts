import { describe, it, expect } from "vitest";
import prettier from "prettier";
import generateRenderFn from "../../../lib/generate/plugins/render-fn";
import { parse } from "../../../lib/parser";

describe("render function", () => {
  const testCases = [
    {
      name: "simple component",
      input: `<view>hello</view>`,
      output: `
function render(data)  {
  return <View>{toString("hello")}</View>
}`,
    },
    {
      name: "component with multiple text children",
      input: `<view>hello {{a}}</view>`,
      output: `
function render(data)  {
  return <View>{toString("hello ", data['a'])}</View>
}`,
    },
    {
      name: "nested component",
      input: `<view><button>hello</button></view>`,
      output: `
function render(data)  {
  return <View><Button>{toString("hello")}</Button></View>
}`,
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
}`,
    },
    {
      name: "component with props",
      input: `<view a="b">hello</view>`,
      output: `
function render(data)  {
  return <View a={"b"}>{toString("hello")}</View>
}`,
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
}`,
    },
    {
      name: "convert class props to className",
      input: `<view class="hello">hello</view>`,
      output: `
function render(data)  {
  return <View className={"hello"}>{toString("hello")}</View>
}`,
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
}`,
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
}`,
    },
    {
      name: "custom component with event listener",
      input: `<my-component onTap="onTap" />`,
      output: `
function render(data)  {
  return (
    <MyComponent onTap={$getComponentEventHandler(this, "onTap")} $isCustomComponent={this.$isCustomComponent} __tag='my-component' />
  );
}`,
    },
    {
      name: "binding data in attribute and children",
      input: `<view attr="{{a}}">{{b}}</view>`,
      output: `
function render(data)  {
  return <View attr={data['a']}>{toString(data['b'])}</View>;
}`,
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
}`,
    },
    //     {
    //       name: "if else elif",
    //       input: `
    // <view key="value" t:if="{{a}}">a</view>
    // <view key="value" t:elif="{{b}}">b</view>
    // <view key="value" t:else="{{c}}">b</view>`,
    //       output: `
    // function render(data)  {
    //   return (
    //     <>
    //     {
    //       data['a']
    //       ? (<View>{"a"}</View>)
    //       : data['b'] ? (<View>{"b"}</View>)
    //       : (<View>{"c"}</View>)
    //     }
    //     </>
    //   );
    // }`,
    //     },
    //     {
    //       name: "for",
    //       input: `<view t:for="{{list}}">{{index}} {{item}}</view>`,
    //       output: `
    // function render(data)  {
    //   return (
    //     <View>
    //       {
    //         data['list'].map((index, item) => {
    //           return <>{index} {item}</>;
    //         })
    //       }
    //     </View>
    //   );
    // }`,
    //     },
    //     {
    //       name: "for with custom index, custom item and binding data",
    //       input: `
    // <view t:for="{{list}}" t:for-index="i" t:for-item="child">
    //   {{i}} {{child}} {{value}}
    // </view>`,
    //       output: `
    // function render(data)  {
    //   return (
    //     <>
    //     {
    //       data['list'].map((i, child) => {
    //         return <>{i} {child} {data['value']}</>;
    //       })
    //     }
    //     </>
    //   );
    // }`,
    //     },
    //     {
    //       name: "slot",
    //       input: `
    // <view>
    //   <slot><view>hello</view></slot>
    //   <slot name="scope"><view>scope</view></slot>
    // </view>`,
    //       output: `
    // function render(data)  {
    //   return (
    //     <View>
    //       {renderSlot(data, "$default", <View>hello</View>)}
    //       {renderSlot(data, "scope", <View>scope</View>)}
    //     </View>
    //   );
    // }`,
    //     },
  ];

  testCases.forEach((tc) => {
    it(tc.name, () => {
      const codeOutput = generateRenderFn(parse(tc.input));
      const output: Array<string> = prettier.format(codeOutput).split("\n");
      const expected: Array<string> = prettier.format(tc.output).split("\n");
      output.forEach((line, index) => {
        console.log(line);
        expect(line).toEqual(expected[index]);
      });
    });
  });
});
