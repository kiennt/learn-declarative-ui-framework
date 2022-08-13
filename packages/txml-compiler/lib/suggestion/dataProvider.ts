const tags = [
  {
    name: "view",
    props: [
      {
        name: "class",
        values: [],
      },
      {
        name: "style",
        values: [],
      },
      {
        name: "onTap",
        values: [],
      },
    ],
  },
  {
    name: "button",
    props: [
      {
        name: "class",
        values: [],
      },
      {
        name: "style",
        values: [],
      },
      {
        name: "onTap",
        values: [],
      },
      {
        name: "click",
        values: [],
      },
    ],
  },
];

function suggestValues(prefix: string, arr: string[]): string[] {
  return arr.filter((item) => item.startsWith(prefix)).sort();
}

export class DataProvider {
  getTags(text: string): string[] {
    return suggestValues(
      text,
      tags.map((item) => item.name)
    );
  }

  getAttrNames(text: string, tag: string): string[] {
    const item = tags.filter((child) => child.name === tag)[0];
    if (!item) return [];
    return suggestValues(
      text,
      item.props.map((item) => item.name)
    );
  }

  getAttrsValues(text: string, tag: string, name: string): string[] {
    const item = tags.filter((child) => child.name === tag)[0];
    if (!item) return [];
    const attr = item.props.filter((child) => child.name === name)[0];
    if (!attr) return [];
    return suggestValues(text, attr.values);
  }
}
