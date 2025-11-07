import React, { useState, useEffect } from "react";
import type { SavingsPlan } from "../types/types";
import { calculateOutput } from "../utils/util";
import {
  TextInput,
  CurrencyInput,
  NumberInput,
  PercentageInput,
  ToggleButtonGroup,
  ContributionAmountInput,
  PanelHeader,
  ErrorMessage,
  OutputCard,
  Button,
} from "./ui";

const MAX_PLANS = 3; // Maximum number of savings plans allowed

interface InputPanelProps {
  plans: SavingsPlan[];
  handleAddPlan: (plan: SavingsPlan) => void;
  editingPlan: SavingsPlan | null;
  handleUpdatePlan: (plan: SavingsPlan) => void;
  handleCancelEdit: () => void;
}

function InputPanel({
  plans,
  handleAddPlan,
  editingPlan,
  handleUpdatePlan,
  handleCancelEdit,
}: InputPanelProps) {
  const id = crypto.randomUUID();
  const [name, setName] = useState<string>("");
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [annualSalary, setAnnualSalary] = useState<number>(0);
  const [currentAge, setCurrentAge] = useState<number>(0);
  const [retirementAge, setRetirementAge] = useState<number>(0);
  const [contributionType, setContributionType] = useState<
    "percentage" | "fixed"
  >("percentage");
  const [contributionAmountFixed, setContributionAmountFixed] =
    useState<number>(0);
  const [contributionAmountPercentage, setContributionAmountPercentage] =
    useState<number>(0);
  const [matchRate, setMatchRate] = useState<number>(0);
  const [expectedReturn, setExpectedReturn] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Populate form when editingPlan changes
  useEffect(() => {
    if (editingPlan) {
      setName(editingPlan.name);
      setCurrentBalance(editingPlan.currentBalance);
      setAnnualSalary(editingPlan.annualSalary);
      setCurrentAge(editingPlan.currentAge);
      setRetirementAge(editingPlan.retirementAge);
      setContributionType(editingPlan.contributionType);
      setContributionAmountFixed(editingPlan.contributionAmountFixed);
      setContributionAmountPercentage(editingPlan.contributionAmountPercentage);
      setMatchRate(editingPlan.matchRate);
      setExpectedReturn(editingPlan.expectedReturn);
      setErrorMessage("");
    } else {
      // Reset form when not editing
      setName("");
      setCurrentBalance(0);
      setAnnualSalary(0);
      setCurrentAge(0);
      setRetirementAge(0);
      setContributionType("percentage");
      setContributionAmountFixed(0);
      setContributionAmountPercentage(0);
      setMatchRate(0);
      setExpectedReturn(0);
      setErrorMessage("");
    }
  }, [editingPlan]);

  const onSubmitPlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous errors

    if (editingPlan) {
      // Update existing plan
      handleUpdatePlan({
        id: editingPlan.id,
        name: name,
        currentBalance: currentBalance,
        annualSalary: annualSalary,
        currentAge: currentAge,
        retirementAge: retirementAge,
        contributionType: contributionType,
        contributionAmountFixed: contributionAmountFixed,
        contributionAmountPercentage: contributionAmountPercentage,
        matchRate: matchRate,
        expectedReturn: expectedReturn,
      });
    } else {
      // Check if limit is reached
      if (plans.length >= MAX_PLANS) {
        setErrorMessage(
          `Maximum of ${MAX_PLANS} plans allowed. Please delete a plan before adding a new one.`
        );
        return;
      }

      // Add new plan
      handleAddPlan({
        id: crypto.randomUUID(),
        name: name,
        currentBalance: currentBalance,
        annualSalary: annualSalary,
        currentAge: currentAge,
        retirementAge: retirementAge,
        contributionType: contributionType,
        contributionAmountFixed: contributionAmountFixed,
        contributionAmountPercentage: contributionAmountPercentage,
        matchRate: matchRate,
        expectedReturn: expectedReturn,
      });

      // Reset form after successful submission
      setName("");
      setCurrentBalance(0);
      setAnnualSalary(0);
      setCurrentAge(0);
      setRetirementAge(0);
      setContributionAmountFixed(0);
      setContributionAmountPercentage(0);
      setMatchRate(0);
      setExpectedReturn(0);
    }
  };

  const output = calculateOutput({
    id: editingPlan?.id || id,
    name: name,
    currentBalance: currentBalance,
    annualSalary: annualSalary,
    currentAge: currentAge,
    retirementAge: retirementAge,
    contributionType: contributionType,
    contributionAmountFixed: contributionAmountFixed,
    contributionAmountPercentage: contributionAmountPercentage,
    matchRate: matchRate,
    expectedReturn: expectedReturn,
  });

  const contributionAmount =
    contributionType === "percentage"
      ? contributionAmountPercentage
      : contributionAmountFixed;

  const handleContributionAmountChange = (value: number) => {
    if (contributionType === "fixed") {
      setContributionAmountFixed(value);
    } else {
      setContributionAmountPercentage(value);
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-slate-100 shadow-md h-full">
      <form onSubmit={onSubmitPlan} className="flex flex-col h-full">
        <PanelHeader
          title={
            editingPlan ? "Edit Savings Plan" : "401(k) Contribution Calculator"
          }
        />

        <div className="flex-1 overflow-y-auto">
          {/* Plan Name */}
          <div className="px-4 py-2">
            <TextInput
              id="planName"
              label="Plan Name"
              value={name}
              onChange={setName}
              placeholder="My Savings Plan"
              required={true}
            />
          </div>

          {/* Current Balance and Annual Salary */}
          <div className="grid grid-cols-2 gap-4 px-4 py-2">
            <CurrencyInput
              id="currentBalance"
              label="Current Balance"
              value={currentBalance}
              onChange={setCurrentBalance}
            />
            <CurrencyInput
              id="annualSalary"
              label="Annual Salary"
              value={annualSalary}
              onChange={setAnnualSalary}
            />
          </div>

          {/* Current Age and Retirement Age */}
          <div className="grid grid-cols-2 gap-4 px-4 py-2">
            <NumberInput
              id="currentAge"
              label="Current Age"
              value={currentAge}
              onChange={setCurrentAge}
              min={18}
              max={100}
            />
            <NumberInput
              id="retirementAge"
              label="Retirement Age"
              value={retirementAge}
              onChange={setRetirementAge}
              min={currentAge}
              max={100}
            />
          </div>

          {/* Contribution Type */}
          <div className="px-4 py-2">
            <ToggleButtonGroup
              label="Contribution Type"
              options={[
                { value: "percentage", label: "% of Salary" },
                { value: "fixed", label: "Fixed $ Per Paycheck" },
              ]}
              value={contributionType}
              onChange={(value) =>
                setContributionType(value as "percentage" | "fixed")
              }
            />
          </div>

          {/* Contribution Amount */}
          <div className="px-4 py-2">
            <ContributionAmountInput
              contributionType={contributionType}
              value={contributionAmount}
              onChange={handleContributionAmountChange}
              annualSalary={annualSalary}
            />
          </div>

          {/* Match Rate and Expected Return*/}
          <div className="grid grid-cols-2 gap-4 px-4 py-2">
            <PercentageInput
              id="matchRate"
              label="Employer Match Rate"
              value={matchRate}
              onChange={setMatchRate}
              min={0}
              max={100}
            />
            <PercentageInput
              id="expectedReturn"
              label="Expected Return"
              value={expectedReturn}
              onChange={setExpectedReturn}
              min={0}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-3 border-b flex-shrink-0">
          <ErrorMessage message={errorMessage} />
          {editingPlan ? (
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleCancelEdit}
                variant="secondary"
                fullWidth
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" fullWidth>
                Apply
              </Button>
            </div>
          ) : (
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={plans.length >= MAX_PLANS}
            >
              {plans.length >= MAX_PLANS
                ? `Maximum ${MAX_PLANS} Savings Plans Reached`
                : "Save Plan"}
            </Button>
          )}
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2 px-4 py-3 border-t flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-2xl font-bold">Output</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <OutputCard
              label="Total Contributions"
              value={output.totalContributions}
              subtitle="Employee + Employer"
            />
            <OutputCard
              label="Projected Savings"
              value={output.projectedSavings}
              subtitle={`At age ${retirementAge || "?"}`}
              variant="primary"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default InputPanel;
