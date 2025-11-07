import React from "react";
import type { SavingsPlan } from "../../types/types";
import { calculateOutput, formatCurrency } from "../../utils/util";
import { Eye, EyeOff } from "lucide-react";

interface PlanCardProps {
  plan: SavingsPlan;
  isVisible: boolean;
  onToggleVisibility: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isVisible,
  onToggleVisibility,
  onEdit,
  onDelete,
}) => {
  const contributionAmount =
    plan.contributionType === "percentage"
      ? `${plan.contributionAmountPercentage}%`
      : formatCurrency(plan.contributionAmountFixed);
  const { projectedSavings } = calculateOutput(plan);

  return (
    <div
      className={`rounded-lg border bg-white p-3 transition-all hover:shadow-md ${
        isVisible
          ? "border-blue-400 bg-blue-50/40"
          : "border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0 items-start gap-2">
          <h4 className="text-lg font-bold text-gray-900 truncate text-left">
            {plan.name}
          </h4>
          <p className="text-[10px] text-gray-500 mt-0.5 text-left">
            Age {plan.currentAge} → {plan.retirementAge}
          </p>
        </div>
        <button
          onClick={onToggleVisibility}
          className={`ml-2 p-1.5 rounded-md transition-colors flex-shrink-0 ${
            isVisible
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
          title={isVisible ? "Hide from chart" : "Show on chart"}
        >
          {isVisible ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <EyeOff className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Contribution and Projected Savings */}
      <div className="grid grid-cols-2 gap-3 mb-3 bg-gray-50 p-2.5 rounded-md">
        <div>
          <p className="text-[10px] text-gray-500 mb-1 text-left">
            Contribution
          </p>
          <p className="text-sm font-semibold text-gray-900 text-left">
            {contributionAmount}
            {plan.contributionType === "percentage" && " of salary"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500 mb-1 text-left">
            Projected at {plan.retirementAge}
          </p>
          <p className="text-sm font-bold text-blue-600 text-left">
            {formatCurrency(projectedSavings)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-1.5 pt-2 border-t border-gray-100">
        <button
          onClick={onEdit}
          className="flex-1 px-2 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 px-2 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

