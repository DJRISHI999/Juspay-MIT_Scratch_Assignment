import React from "react";

export default function Sprite({ sprite, style }) {
  const bubbleStyle = {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: 'translateX(-50%) translateY(-10px)',
    padding: '8px 12px',
    borderRadius: '10px',
    color: 'black',
    fontSize: '14px',
    maxWidth: '150px',
    textAlign: 'center',
    zIndex: 10,
  };

  const speechBubbleStyle = {
    ...bubbleStyle,
    backgroundColor: 'white',
    border: '1px solid #ccc',
  };

  const thoughtBubbleStyle = {
    ...bubbleStyle,
    backgroundColor: 'white',
    border: '1px dashed #ccc',
    borderRadius: '50%',
  };

  return (
    <div
      className="transition-all duration-300 w-full h-full relative"
      style={style}
    >
      <img
        src={sprite.image}
        alt={sprite.name}
        className="w-full h-full object-contain"
      />
      {sprite.message && (
        <div style={sprite.messageType === 'say' ? speechBubbleStyle : thoughtBubbleStyle}>
          {sprite.message}
          {sprite.messageType === 'say' && (
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '10px solid white',
              filter: 'drop-shadow(0 1px 0.5px #ccc)'
            }}></div>
          )}
        </div>
      )}
    </div>
  );
}
