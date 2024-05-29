"use client"

import { FC, ChangeEvent } from "react";

type InputItemProps = {
  name: string;
  value?: string;
  placeholder?: string;
  type: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  mb?: number;
  bg?: string;
  size?: string;
};

export const InputItem: FC<InputItemProps> = ({ name, placeholder, value, type, onChange, mb, bg, size }) => {
  const marginClass = mb ? `mb-${mb}` : '';
  const backgroundClass = bg ? `bg-${bg}` : 'bg-gray-50';
  const sizeClass = size ? `text-${size}` : '';

  return (
    <input
      className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${marginClass} ${backgroundClass} ${sizeClass}`}
      name={name}
      placeholder={placeholder}
      value={value}
      required
      onChange={onChange}
      type={type}
      style={{ fontSize: "10pt" }}
    />
  );
};

export default InputItem;