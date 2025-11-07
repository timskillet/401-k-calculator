import React from "react";

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleButtonGroupProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export const ToggleButtonGroup: React.FC<ToggleButtonGroupProps> = ({
  options,
  value,
  onChange,
  label,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-left text-sm font-medium">{label}</label>
      )}
      <div className="flex gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`flex-1 rounded-lg border-2 px-4 py-2 transition-all ${
              value === option.value
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-slate-200 hover:border-slate-300"
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
