import type { SavingsPlan } from "../types/types";
import { PanelHeader, PlanCard } from "./ui";

interface PlansPanelProps {
  plans: SavingsPlan[];
  visiblePlans: Set<string>;
  onDeletePlan: (planId: string) => void;
  onEditPlan: (plan: SavingsPlan) => void;
  onToggleVisibility: (planId: string) => void;
}

function PlansPanel({
  plans,
  visiblePlans,
  onDeletePlan,
  onEditPlan,
  onToggleVisibility,
}: PlansPanelProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-slate-100 shadow-md h-full">
      <PanelHeader title="Savings Plans" />

      {plans.length === 0 ? (
        <div className="flex-1 flex items-center justify-center px-4 py-3">
          <h2 className="text-gray-500 text-center">
            No savings plans yet. Create one to get started!
          </h2>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-2 p-3">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isVisible={visiblePlans.has(plan.id)}
              onToggleVisibility={() => onToggleVisibility(plan.id)}
              onEdit={() => onEditPlan(plan)}
              onDelete={() => onDeletePlan(plan.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PlansPanel;
