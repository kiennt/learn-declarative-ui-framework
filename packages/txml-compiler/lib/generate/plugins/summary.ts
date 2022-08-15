import { ElementNode, NodeTypes } from "../../parser/ast";
import { NodePath, visit } from "../../parser/visitor";

type Summary = {
  components: Array<string>;
  useIf: boolean;
  useFor: boolean;
  useSlot: boolean;
  useTemplate: boolean;
  useBlock: boolean;
};

function createRootPath(node: ElementNode): NodePath {
  return {
    isRoot: true,
    node,
  };
}

export default function plugin(nodes: Array<ElementNode>): Summary {
  const visitor = {
    summary: {
      components: [] as Array<string>,
      useIf: false,
      useFor: false,
      useTemplate: false,
      useSlot: false,
      useBlock: false,
    },

    checkTagName(tag: string) {
      if (tag === "slot") {
        this.summary.useSlot = true;
      } else if (tag === "block") {
        this.summary.useBlock = true;
      } else if (tag === "template") {
        this.summary.useTemplate = true;
      } else if (!this.summary.components.includes(tag)) {
        this.summary.components.push(tag);
      }
    },

    checkProps(props: ElementNode["props"]) {
      // skip if we know that document use If and For
      if (this.summary.useIf && this.summary.useFor) return;
      props
        .filter((prop) => prop.type == NodeTypes.DIRECTIVE)
        .forEach((prop) => {
          if (prop.name === "if") {
            this.summary.useIf = true;
          } else if (prop.name === "for") {
            this.summary.useFor = true;
          }
        });
    },

    ElementNode(path: NodePath) {
      const node = path.node as ElementNode;
      this.checkTagName(node.tag);
      this.checkProps(node.props);
    },
  };

  nodes.forEach((node) => visit(createRootPath(node), visitor));
  return visitor.summary;
}
