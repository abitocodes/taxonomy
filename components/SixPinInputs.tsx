"use client"

import React, { useState, useRef } from 'react';

interface SixPinInputsProps {
    id: string;
    disabled: boolean;
    onChange: (pin: string) => void;
}

export const SixPinInputs: React.FC<SixPinInputsProps> = ({ id, disabled, onChange }) => {
  const [inputs, setInputs] = useState(Array(6).fill(''));
  const inputRefs = Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null));

  const handleInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputs = [...inputs];
    newInputs[index] = event.target.value;
    setInputs(newInputs);
    if (event.target.value.length === 1 && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
    onChange(newInputs.join(''));
  };

  return (
    <div className="max-w-sm mx-auto">
      <div className="flex justify-center mb-2 space-x-2 rtl:space-x-reverse">
        {inputs.map((_, index) => (
          <div key={index}>
            <input
              type="text"
              maxLength={1}
              id={`${id}_${index + 1}`}
              ref={inputRefs[index]}
              className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
              disabled={disabled || index > 0 && inputs[index - 1].length === 0}
              onChange={handleInputChange(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};