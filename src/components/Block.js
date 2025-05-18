import React from "react";

export default function Block({ block, isDragging, onUpdateInput }) {
  if (!block || typeof block !== 'object') {
    return <div className="bg-red-500 text-white p-2 rounded">Error: Invalid block data</div>;
  }

  const { type, label, inputs, suffix, id: blockId } = block;

  const getBlockColor = (blockType) => {
    if (!blockType) {
      return "bg-gray-500";
    }
    switch (blockType) {
      case "looks":
        return "bg-purple-500";
      case "motion":
        return "bg-blue-500";
      case "control":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleInputChange = (inputIndex, value) => {
    if (typeof onUpdateInput === 'function') {
      onUpdateInput(inputIndex, value);
    }
  };

  return (
    <div
      className={`flex flex-wrap items-baseline p-2 rounded shadow text-white text-sm min-h-[40px] ${getBlockColor(type)} ${isDragging ? "opacity-50" : ""}`}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      <span className="font-semibold mr-1">{label}</span>
      {inputs && inputs.map((input, index) => {
        const inputKey = `input-${blockId}-${index}`;
        const labelKey = `label-${blockId}-${index}`;

        if (input.type === "label") {
          return <span key={labelKey} className="mx-1">{input.value}</span>;
        }
        return (
          <input
            key={inputKey}
            type={input.type === "number" ? "number" : "text"}
            value={String(input.value || '')}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className={`mx-1 px-3 py-2 rounded text-black ${input.type === 'text' ? 'w-16 text-left' : 'w-14 text-center'} text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300`}
          />
        );
      })}
      {suffix && <span className="ml-1">{suffix}</span>}
    </div>
  );
}
