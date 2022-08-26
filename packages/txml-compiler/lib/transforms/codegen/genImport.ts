import { ElementNode, RootNode } from "../../parser/ast";
import { NodePath, createRootPath } from "../context";
import { WithImport } from "../plugins/import";
import { getOpts } from "../utils";
import { visit } from "../visitor";

export type I<T> = WithImport<T> & {
  components: Array<string>;
  importCode: string;
};

function rmlLibrary(name: string): string {
  return `${getOpts("rmlRuntimeLibraryName")}/${name}`;
}

function minusToPascal(name: string): string {
  return name
    .split("-")
    .map(item => {
      if (item.length === 0) return item;
      return `${item[0].toUpperCase()}${item.slice(1)}`;
    })
    .join("");
}

type Options = {
  customComponents: Record<string, string>;
};

export default function plugin(
  _root: RootNode,
  opts: Options = { customComponents: {} }
): string {
  const root = _root as I<RootNode>;
  root.components = [];

  const isCustomComponent = (name: string) =>
    opts.customComponents[name] !== undefined;

  const getCustomComponentPath = (name: string) => opts.customComponents[name];

  const visitor = {
    ElementNode(_paths: NodePath) {
      const node = _paths.node as ElementNode;
      const tag = node.tag;
      if (!root.components.includes(tag)) {
        root.components.push(tag);
      }
    },

    RootNode: {
      exit(_paths: NodePath) {
        root.importCode = `
import React from 'react';
${[
  "iterate",
  "createRoot",
  "useTemplate",
  "createTemplate",
  "renderSlot",
  "resolveScopedSlots",
  "getSJSMember",
  "toString",
  "getLooseDataMember"
]
  .map(name => {
    return `import ${name} from '${rmlLibrary(name)}';`;
  })
  .join("\n")}
import { getComponentClass } from '${getOpts("library")}';
${root.components
  .map(name => {
    const componentName = minusToPascal(name);
    if (isCustomComponent(name)) {
      return `
const ${componentName} = getComponentClass('${getCustomComponentPath(name)}');`;
    } else {
      return `
import { ${componentName} } from '${getOpts("library")}';`;
    }
  })
  .join("\n")}

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
};`;
      }
    }
  };

  visit(createRootPath(root), visitor);
  return root.importCode;
}
