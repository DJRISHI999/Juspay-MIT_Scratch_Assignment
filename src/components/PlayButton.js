import React from 'react';

const PlayButton = ({ onTogglePlayPause, isPlaying, isPaused }) => {
  let buttonText = 'Play';
  if (isPlaying) {
    buttonText = isPaused ? 'Resume' : 'Pause';
  }

  return (
    <button
      onClick={onTogglePlayPause}
      className={`text-white font-bold py-2 px-4 rounded ${
        isPlaying && !isPaused ? 'bg-yellow-500 hover:bg-yellow-700' :
        isPlaying && isPaused ? 'bg-blue-500 hover:bg-blue-700' :    
        'bg-green-500 hover:bg-green-700'
      }`}
    >
      {buttonText}
    </button>
  );
};

export default PlayButton;
