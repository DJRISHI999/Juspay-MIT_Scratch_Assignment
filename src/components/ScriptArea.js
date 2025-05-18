import React from "react";
import { useDrop } from "react-dnd";
import Block from "./Block";

export default function ScriptArea({ blocks, onDropBlock, onReorderBlock, onUpdateBlock, onDeleteBlock }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "BLOCK",
    drop: (item, monitor) => {
      const droppedBlock = { ...item };
      onDropBlock(droppedBlock);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`min-h-[120px] bg-gray-50 border p-2 rounded flex flex-col transition ${isOver ? "bg-blue-200" : ""}`}
    >
      {blocks.length === 0 && (
        <div className="text-gray-400 text-sm italic">Drag blocks here</div>
      )}
      {blocks.map((block, i) => (
        <div
          className="relative"
          key={block.id || i}
          style={i > 0 ? { marginTop: '-8px' } : {}}
        >
          <Block
            block={block}
            onChange={b => onUpdateBlock && onUpdateBlock(i, b)}
            onUpdateInput={(inputIndex, value) => onUpdateBlock(i, inputIndex, value)}
          />
          <button
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-red-600"
            title="Delete Block"
            onClick={() => onDeleteBlock && onDeleteBlock(i)}
          >
            🗑
          </button>
        </div>
      ))}
    </div>
  );
}
