import { useState } from "react";
import { ContributionsPanel } from "./components/ContributionsPanel";
import type { Contribution, SavingsPlan } from "./types/types";
import InputPanel from "./components/InputPanel";
import ChartsPanel from "./components/ChartsPanel";
import Header from "./components/Header";
import PlansPanel from "./components/PlansPanel";

const mockContributions = (): Contribution[] => {
  const contributions: Contribution[] = [];
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month

  for (let i = 1; i <= 26; i++) {
    const contributionDate = new Date(startDate);
    contributionDate.setDate(contributionDate.getDate() - (i - 1) * 14); // Subtract 14 days for each bi-weekly period

    contributions.push({
      id: i.toString(),
      employeeContribution: 1000,
      employerMatch: 500,
      payPeriod: i,
      date: contributionDate,
    });
  }

  return contributions;
};

function App() {
  const [plans, setPlans] = useState<SavingsPlan[]>([]);
  const [visiblePlans, setVisiblePlans] = useState<Set<string>>(new Set());

  const togglePlanVisibility = (planId: string) => {
    setVisiblePlans((prev) => {
      const newSet = new Set(prev);
      newSet.has(planId) ? newSet.delete(planId) : newSet.add(planId);
      return newSet;
    });
  };

  const handleAddPlan = (plan: SavingsPlan) => {
    setPlans((prev) => [...prev, plan]);
    setVisiblePlans((prev) => {
      const newSet = new Set(prev);
      newSet.add(plan.id);
      return newSet;
    });
  };

  const handleDeletePlan = (planId: string) => {
    if (window.confirm("Are you sure you want to delete this savings plan?")) {
      setPlans((prev) => prev.filter((plan) => plan.id !== planId));
      setVisiblePlans((prev) => {
        const newSet = new Set(prev);
        newSet.delete(planId);
        return newSet;
      });
    }
  };

  const [editingPlan, setEditingPlan] = useState<SavingsPlan | null>(null);

  const handleEditPlan = (plan: SavingsPlan) => {
    setEditingPlan(plan);
  };

  const handleUpdatePlan = (updatedPlan: SavingsPlan) => {
    setPlans((prev) =>
      prev.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan))
    );
    setEditingPlan(null);
  };

  const handleCancelEdit = () => {
    setEditingPlan(null);
  };

  return (
    <div className="flex flex-col bg-slate-300">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 items-stretch">
        {/* Contributions Panel - Full width on mobile, first column on desktop */}
        <div className="lg:col-span-2">
          <ContributionsPanel contributions={mockContributions()} />
        </div>

        {/* Input Panel */}
        <div className="flex flex-col">
          <InputPanel
            plans={plans}
            handleAddPlan={handleAddPlan}
            editingPlan={editingPlan}
            handleUpdatePlan={handleUpdatePlan}
            handleCancelEdit={handleCancelEdit}
          />
        </div>

        {/* Plans Panel with scrollbar */}
        <div className="flex flex-col">
          <PlansPanel
            plans={plans}
            visiblePlans={visiblePlans}
            onDeletePlan={handleDeletePlan}
            onEditPlan={handleEditPlan}
            onToggleVisibility={togglePlanVisibility}
          />
        </div>

        {/* Charts Panel - Full width on mobile, spans both columns on desktop */}
        <div className="lg:col-span-2">
          <ChartsPanel
            plans={plans}
            visiblePlans={visiblePlans}
            togglePlanVisibility={togglePlanVisibility}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
