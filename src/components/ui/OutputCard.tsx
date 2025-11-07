import React from "react";
import { formatCurrency } from "../../utils/util";

interface OutputCardProps {
  label: string;
  value: number;
  subtitle?: string;
  variant?: "default" | "primary";
}

export const OutputCard: React.FC<OutputCardProps> = ({
  label,
  value,
  subtitle,
  variant = "default",
}) => {
  const bgColor = variant === "primary" ? "bg-blue-50" : "bg-gray-50";
  const textColor = variant === "primary" ? "text-blue-600" : "text-gray-600";
  const valueColor = variant === "primary" ? "text-blue-700" : "text-gray-900";
  const subtitleColor =
    variant === "primary" ? "text-blue-500" : "text-gray-500";

  return (
    <div className={`${bgColor} rounded-lg p-4`}>
      <p className={`text-sm ${textColor} mb-1`}>{label}</p>
      <p className={`text-xl font-bold ${valueColor}`}>
        {formatCurrency(value)}
      </p>
      {subtitle && (
        <p className={`text-xs ${subtitleColor} mt-1`}>{subtitle}</p>
      )}
    </div>
  );
};
