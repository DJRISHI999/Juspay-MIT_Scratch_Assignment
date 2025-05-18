import React from 'react';

const ResetButton = ({ onReset }) => {
  return (
    <button
      onClick={onReset}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Reset
    </button>
  );
};

export default ResetButton;
