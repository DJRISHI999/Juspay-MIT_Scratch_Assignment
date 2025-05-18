import React from 'react';
import { useDrag, DragPreviewImage } from 'react-dnd';
import Sprite from './Sprite';

const DraggableSprite = ({ sprite, onMove }) => {
  const [{ isDragging }, drag, previewConnect] = useDrag(() => ({
    type: 'SPRITE',
    item: { id: sprite.id, x: sprite.x, y: sprite.y },
    end: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta && item) {
        const newX = Math.round(item.x + delta.x);
        const newY = Math.round(item.y + delta.y);
        onMove(item.id, newX, newY);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [sprite.id, sprite.x, sprite.y, onMove]);

  return (
    <>
      <DragPreviewImage connect={previewConnect} src={"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"} />
      <div
        ref={drag}
        style={{
          position: 'absolute',
          left: sprite.x,
          top: sprite.y,
          width: 48,
          height: 48,
          opacity: isDragging ? 0.5 : 1,
          cursor: 'move',
          transform: `rotate(${-sprite.direction}deg)`,
          transformOrigin: 'center center',
          transition: isDragging ? 'opacity 0.2s' : 'opacity 0.2s, left 0.3s, top 0.3s, transform 0.3s',
        }}
      >
        <Sprite sprite={sprite} />
      </div>
    </>
  );
};

export default DraggableSprite;
