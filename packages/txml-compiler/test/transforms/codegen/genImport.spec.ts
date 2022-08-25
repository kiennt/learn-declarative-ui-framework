import { parse } from "../../../lib/parser";
import { transform } from "../../../lib/transforms";
import generateImport from "../../../lib/transforms/codegen/genImport";
import prettier from "prettier";
import { describe, expect, it } from "vitest";

describe("import", () => {
  const testCases = [
    {
      name: "component",
      customComponents: {
        "my-component": "./components/my-component/index"
      },
      input: `
<view>
  <my-component />
</view>
      `,
      output: `
import iterate from '@hoangviet/rml-runtime/iterate';
import createRoot from '@hoangviet/rml-runtime/createRoot';
import createBlock from '@hoangviet/rml-runtime/createBlock';
import useTemplate from '@hoangviet/rml-runtime/useTemplate';
import createTemplate from '@hoangviet/rml-runtime/createTemplate';
import renderSlot from '@hoangviet/rml-runtime/renderSlot';
import resolveScopedSlots from '@hoangviet/rml-runtime/resolveScopedSlots';
import getSJSMember from '@hoangviet/rml-runtime/getSJSMember';
import toString from '@hoangviet/rml-runtime/toString';
import getLooseDataMember from '@hoangviet/rml-runtime/getLooseDataMember';
import { getComponentClass } from '@tiki/tf-miniapp';
import { View } from '@tiki/tf-miniapp';
import React from 'react';

const MyComponent = getComponentClass('./components/my-component/index');

const $getComponentEventHandler = function (instance, name) {
  return instance.$getComponentEventHandler && instance.$getComponentEventHandler(name);
};

const $getEventHandler = function (instance, name) {
  return instance.$getEventHandler(name);
};

const $getRefHandler = function (instance, name) {
  return instance.$getRefHandler(name);
};

const $getComRefHandler = function (instance, name) {
  return instance.$getComRefHandler && instance.$getComRefHandler(name);
};
      `
    }
  ];

  testCases.forEach(tc => {
    it(tc.name, () => {
      const root = parse(tc.input);
      transform(root);
      const codeOutput = generateImport(root, {
        customComponents: tc.customComponents
      });
      const output: Array<string> = prettier.format(codeOutput).split("\n");
      const expected: Array<string> = prettier.format(tc.output).split("\n");
      output.forEach((line, index) => {
        expect(expected[index]).toEqual(line);
      });
    });
  });
});
