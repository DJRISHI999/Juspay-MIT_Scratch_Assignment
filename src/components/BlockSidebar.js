import React from "react";
import { useDrag } from "react-dnd";
import Block from "./Block";

const BLOCKS = {
  motion: [
    { type: "motion", label: "Move", inputs: [{ type: "number", value: 10 }], suffix: "steps", blockType: "move" },
    { type: "motion", label: "Turn ↻", inputs: [{ type: "number", value: 15 }], suffix: "degrees", blockType: "turn_cw" },
    { type: "motion", label: "Turn ↺", inputs: [{ type: "number", value: 15 }], suffix: "degrees", blockType: "turn_ccw" },
    { type: "motion", label: "Go to x:", inputs: [{type: "label", value:"x:"}, { type: "number", value: 0 }, {type: "label", value:"y:"}, { type: "number", value: 0 }], blockType: "goto_xy" }
  ],
  looks: [
    { type: "looks", label: "Say", inputs: [{ type: "text", value: "Hello!" }, {type: "label", value:"for"}, { type: "number", value: 2 }], suffix: "seconds", blockType: "say_for_secs" },
    { type: "looks", label: "Think", inputs: [{ type: "text", value: "Hmm..." }, {type: "label", value:"for"}, { type: "number", value: 2 }], suffix: "seconds", blockType: "think_for_secs" }
  ],

};

function createBlockInstance(blockTemplate) {
  const newInstance = {
    ...blockTemplate,
    id: Date.now() + Math.random().toString(36).substr(2, 9),
    actionId: blockTemplate.blockType,
    inputs: blockTemplate.inputs.map(input => ({ ...input, id: Date.now() + Math.random().toString(36).substr(2, 9) }))
  };
  return newInstance;
}

const DraggableBlock = React.memo(({ block }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "BLOCK",
    item: () => {
      const instance = createBlockInstance(block);
      return instance;
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [block]);

  return (
    <div ref={drag}>
      <Block block={block} isDragging={isDragging} />
    </div>
  );
});

export default function BlockSidebar() {
  const [tab, setTab] = React.useState("motion");

  const getTabStyle = (tabType) => {
    switch (tabType) {
      case "motion":
        return {
          active: "bg-blue-500 text-white",
          inactive: "bg-blue-100 text-blue-700 hover:bg-blue-200"
        };
      case "looks":
        return {
          active: "bg-purple-500 text-white",
          inactive: "bg-purple-100 text-purple-700 hover:bg-purple-200"
        };
      case "control":
        return {
          active: "bg-yellow-500 text-white",
          inactive: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
        };
      default:
        return {
          active: "bg-gray-500 text-white",
          inactive: "bg-gray-100 text-gray-700 hover:bg-gray-200"
        };
    }
  };

  return (
    <aside className="w-56 bg-blue-100 border-r px-3 py-4 flex flex-col min-w-0">
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          className={`px-3 py-1 rounded font-semibold text-sm transition ${tab === "motion" ? getTabStyle("motion").active : getTabStyle("motion").inactive}`}
          onClick={() => setTab("motion")}
        >Motion</button>
        <button
          className={`px-3 py-1 rounded font-semibold text-sm transition ${tab === "looks" ? getTabStyle("looks").active : getTabStyle("looks").inactive}`}
          onClick={() => setTab("looks")}
        >Looks</button>
      </div>

      <div className="flex flex-col gap-2">
        {BLOCKS[tab]?.map((block, i) => (
          <DraggableBlock key={i} block={block} />
        ))}
      </div>
    </aside>
  );
}
