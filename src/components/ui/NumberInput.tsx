import React from "react";

interface NumberInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  required?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = "0",
  min,
  max,
  required = false,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-left text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type="number"
        value={value === 0 ? "" : value}
        min={min}
        max={max}
        onChange={(e) =>
          onChange(e.target.value === "" ? 0 : Number(e.target.value))
        }
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};
