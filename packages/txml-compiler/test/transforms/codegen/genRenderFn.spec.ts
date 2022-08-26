import { parse } from "../../../lib/parser";
import { defaultPreset, transform } from "../../../lib/transforms";
import generateRenderFn from "../../../lib/transforms/codegen/genRenderFn";
import prettier from "prettier";
import { describe, expect, it } from "vitest";

describe("render function", () => {
  const testCases = [
    {
      name: "simple component",
      input: `<view>hello</view>`,
      output: `
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
  return <View>{toString("hello")}</View>
}`
    },
    {
      name: "component with multiple text children",
      input: `<view>hello {{a}}</view>`,
      output: `
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
  return <View>{toString("hello ", data['a'])}</View>
}`
    },
    {
      name: "nested component",
      input: `<view><button>hello</button></view>`,
      output: `
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
  return <View><Button>{toString("hello")}</Button></View>
}`
    },
    {
      name: "component with object access",
      input: `<view>{{a.b.c.d.e}}</view>`,
      output: `
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
  return <View>{toString(getLooseDataMember(data['a'], 'b', 'c', 'd', 'e'))}</View>
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
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
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
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
  return <View a={"b"}>{toString("hello")}</View>
}`
    },
    {
      name: "component with props complex",
      input: `<view a="start {{a + b}} end">hello</view>`,
      output: `
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
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
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
  return <View className={"hello"}>{toString("hello")}</View>
}`
    },
    {
      name: "native component with event listener",
      input: `<view onTap="onTap">hello</view>`,
      output: `
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
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
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
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
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
  return (
    <MyComponent onTap={$getComponentEventHandler(this, "onTap")} $isCustomComponent={this.$isCustomComponent} __tag='my-component' />
  );
}`
    },
    {
      name: "binding data in attribute and children",
      input: `<view attr="{{a}}">{{b}}</view>`,
      output: `
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
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
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
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
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
  return (
    <>
    {
      iterate(data['list'], (item, index) => {
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
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
  return (
    <>
    {
      iterate(data['list'], (child, i) => {
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
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
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
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
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
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
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
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
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
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
  return (
    <View>
      {renderSlot(data, "$default", <><View>{toString("default slot")}</View></>)}
      <View attr={"value"}>{toString("view")}</View>
      {renderSlot(data, "named", <><View>{toString("named slot")}</View></>)}
    </View>
  );
}`
    },
    {
      name: "using template with name is string",
      input: `<template is="hello" data="{{x}}" />`,
      output: `
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
  return (
    <>{useTemplate($templates["hello"], { x: data['x'] }, undefined, this)}</>
  );
}`
    },
    {
      name: "using template with name is expr",
      input: `<template is="{{x + y}}" data="{{x}}" />`,
      output: `
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
  return (
    <>{useTemplate($templates[data['x'] + data['y']], { x: data['x'] }, undefined, this)}</>
  );
}`
    },
    {
      name: "using template with data is expression",
      input: `<template is="hello" data="{{x, y}}" />`,
      output: `
let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
  return (
    <>{useTemplate($templates["hello"], { 
      x: data['x'], 
      y: data['y'] 
    }, undefined, this)}</>
  );
}`
    },
    {
      name: "define template without other code",
      input: `
<template name="hello"></template>`,
      output: `
let $template = void 0;
export const $ownTemplates = {};

$template = $ownTemplates['hello'] = function (data) {
  return null;
}
$template.Component = createTemplate('hello', $template);

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
  return null;
}`
    },
    {
      name: "define template",
      input: `
<template name="hello">
  <view>message</view>
  <view>{{message}}</view>
</template>`,
      output: `
let $template = void 0;
export const $ownTemplates = {};

$template = $ownTemplates['hello'] = function (data) {
  return (
    <>
      <View>{toString("message")}</View>
      <View>{toString(data["message"])}</View>
    </>
  );
}
$template.Component = createTemplate('hello', $template);

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
  return null;
}`
    },
    {
      name: "define multiple template",
      input: `
<template name="name1"></template>
<template name="name2"></template>
`,
      output: `
let $template = void 0;
export const $ownTemplates = {};

$template = $ownTemplates['name1'] = function (data) {
  return null;
}
$template.Component = createTemplate('name1', $template);

$template = $ownTemplates['name2'] = function (data) {
  return null;
}
$template.Component = createTemplate('name2', $template);

const $templates = {
  ...$ownTemplates
};
export default function render(data) {
  return null;
}`
    },
    {
      name: "using import",
      input: `
<import src="./a.txml" />      
<import src="./b.txml" />      
`,
      output: `
import { $ownTemplates as template0 } from "./a.txml";
import { $ownTemplates as template1 } from "./b.txml";

let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...template0,
  ...template1,
  ...$ownTemplates
};
export default function render(data) {
  return null;
}`
    },
    {
      name: "using import with include",
      input: `
<include src="./a.txml" />      
<import src="./b.txml" />      
`,
      output: `
import template0 from "./a.txml";
import { $ownTemplates as template1 } from "./b.txml";

let $template = void 0;
export const $ownTemplates = {};

const $templates = {
  ...template1,
  ...$ownTemplates
};
export default function render(data) {
  return <>{template0.apply(this, arguments)}</>;
}`
    }
  ];

  testCases.forEach(tc => {
    it(tc.name, () => {
      const root = parse(tc.input);
      transform(root, [...defaultPreset]);
      const codeOutput = generateRenderFn(root);
      const output: Array<string> = prettier.format(codeOutput).split("\n");
      const expected: Array<string> = prettier.format(tc.output).split("\n");
      console.log(tc.name);
      console.log("output is", output);
      console.log("expected is", expected);
      expect(output).toEqual(expected);
    });
  });
});
