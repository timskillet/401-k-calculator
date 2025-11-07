import React from "react";
import { formatCurrency } from "../../utils/util";

interface SummaryCardProps {
  label: string;
  value: number;
  variant?: "blue" | "green" | "red";
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  value,
  variant = "blue",
}) => {
  const variants = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
      value: "text-blue-900",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-600",
      value: "text-green-900",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-600",
      value: "text-red-900",
    },
  };

  const style = variants[variant];

  return (
    <div className={`${style.bg} rounded-lg p-3 border ${style.border}`}>
      <p className={`text-xs ${style.text} font-medium`}>{label}</p>
      <p className={`text-lg ${style.value} font-bold`}>
        {formatCurrency(value)}
      </p>
    </div>
  );
};
