import React from "react";
import { RangeSlider } from "./RangeSlider";

interface ContributionAmountInputProps {
  contributionType: "percentage" | "fixed";
  value: number;
  onChange: (value: number) => void;
  annualSalary: number;
}

export const ContributionAmountInput: React.FC<
  ContributionAmountInputProps
> = ({ contributionType, value, onChange, annualSalary }) => {
  const maxValue =
    contributionType === "fixed" && annualSalary > 0 ? annualSalary / 26 : 100;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label
          htmlFor="contributionAmount"
          className="text-left text-sm font-medium"
        >
          Contribution Amount
        </label>
        <div className="relative">
          {contributionType === "fixed" && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
              $
            </span>
          )}
          <input
            id="contributionAmount"
            type="number"
            value={value || ""}
            onChange={(e) => {
              const numValue =
                e.target.value === "" ? 0 : Number(e.target.value);
              onChange(numValue);
            }}
            className={`w-full ${
              contributionType === "fixed" ? "pl-7 pr-3" : "pl-3 pr-7"
            } py-2 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            step={contributionType === "percentage" ? 0.5 : 100}
            max={maxValue}
          />
          {contributionType === "percentage" && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
              %
            </span>
          )}
        </div>
      </div>
      <RangeSlider
        value={value}
        onChange={onChange}
        min={0}
        max={maxValue}
        className="mt-2"
      />
    </div>
  );
};
