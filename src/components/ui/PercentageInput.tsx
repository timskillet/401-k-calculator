import React from "react";

interface PercentageInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  required?: boolean;
}

export const PercentageInput: React.FC<PercentageInputProps> = ({
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
      <div className="relative">
        <input
          id={id}
          type="number"
          value={value === 0 ? "" : value}
          min={min}
          max={max}
          onChange={(e) =>
            onChange(e.target.value === "" ? 0 : Number(e.target.value))
          }
          className="w-full text-right pl-3 pr-7 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
          required={required}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
          %
        </span>
      </div>
    </div>
  );
};
