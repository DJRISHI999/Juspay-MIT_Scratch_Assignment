import React from 'react';

export default function HeroFeatureCheckbox({ isEnabled, onToggle }) {
  return (
    <div className="flex items-center space-x-2 p-2 bg-yellow-100 border border-yellow-300 rounded shadow-sm">
      <input
        type="checkbox"
        id="heroFeatureToggle"
        checked={isEnabled}
        onChange={onToggle}
        className="form-checkbox h-5 w-5 text-yellow-600 transition duration-150 ease-in-out rounded focus:ring-yellow-500"
      />
      <label htmlFor="heroFeatureToggle" className="text-sm font-medium text-yellow-700">
        Enable Hero Feature (Swap Scripts on Collision)
      </label>
    </div>
  );
}