import React from "react";
import DraggableSprite from "./DraggableSprite";

export default function Canvas({ sprites, onSpriteMove, children, spriteDimension }) {
  return (
    <div className="relative w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-blue-200 min-h-[400px]">
      {sprites.map((sprite) => (
        <DraggableSprite key={sprite.id} sprite={sprite} onMove={onSpriteMove} dimension={spriteDimension} />
      ))}
      {children}
    </div>
  );
}
