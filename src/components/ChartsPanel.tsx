import { useState, useEffect } from "react";
import type { SavingsPlan } from "../types/types";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  calculateProjectionData,
  calculateStackedBarData,
} from "../utils/util";
import { PanelHeader, TabButtons } from "./ui";

interface ChartsPanelProps {
  plans: SavingsPlan[];
  visiblePlans: Set<string>;
  togglePlanVisibility: (planId: string) => void;
}

// Color palette for different lines
const COLORS = [
  "#4f46e5", // indigo
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#14b8a6", // teal
];

function ChartsPanel({
  plans,
  visiblePlans,
  togglePlanVisibility,
}: ChartsPanelProps) {
  const [activeTab, setActiveTab] = useState<"line" | "bar">("line");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  // Set default selected plan when switching to bar chart tab
  useEffect(() => {
    if (activeTab === "bar" && plans.length > 0) {
      if (!selectedPlanId || !plans.find((p) => p.id === selectedPlanId)) {
        setSelectedPlanId(plans[0].id);
      }
    }
  }, [activeTab, plans, selectedPlanId]);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-left">
          <p className="mb-2 text-slate-900">Age {label}</p>
          {payload.map((entry: any, index: number) => {
            return (
              <p key={index} style={{ color: entry.color }}>
                {plans.find((p) => p.id === entry.dataKey)?.name}: $
                {entry.value.toLocaleString()}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const BarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg text-left">
          <p className="mb-2 text-slate-900 font-semibold">Age {label}</p>
          <p className="text-sm text-gray-600 mb-1">
            Employee Contribution: ${data.employeeContribution.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            Employer Contribution: ${data.employerContribution.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            Growth: ${data.growth.toLocaleString()}
          </p>
          <p className="text-sm font-semibold text-gray-900 mt-2 pt-2 border-t">
            Total Balance: ${data.totalBalance.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const data = calculateProjectionData(plans, visiblePlans);
  // For bar chart, create a Set with only the selected plan
  const barChartVisiblePlans = selectedPlan
    ? new Set([selectedPlan.id])
    : new Set<string>();
  const barData = selectedPlan
    ? calculateStackedBarData(plans, barChartVisiblePlans)
    : [];

  if (plans.length === 0) {
    return (
      <div className="flex flex-col gap-3 rounded-xl border shadow-md bg-slate-100 h-[500px] flex items-center justify-center">
        <p className="text-gray-500">No data to display</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-slate-100 shadow-md">
      <PanelHeader title="Retirement Projection" />

      <TabButtons
        tabs={[
          { id: "line", label: "Line Chart" },
          { id: "bar", label: "Stacked Bar Chart" },
        ]}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as "line" | "bar")}
      />

      {/* Legend - Only show on Line Chart tab */}
      {activeTab === "line" && (
        <div className="px-4 py-3">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {plans.map((plan, index) => {
              const color = COLORS[index % COLORS.length];
              const isVisible = visiblePlans.has(plan.id);

              return (
                <label
                  key={plan.id}
                  className="flex cursor-pointer items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => togglePlanVisibility(plan.id)}
                    style={{ accentColor: color }}
                    className="w-4 h-4 border-gray-300 rounded cursor-pointer"
                  />
                  <span
                    className={`text-sm font-medium ${
                      isVisible ? "text-gray-900" : "text-gray-400 line-through"
                    }`}
                  >
                    {plan.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Plan Selector - Only show on Stacked Bar Chart tab */}
      {activeTab === "bar" && (
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <label
              htmlFor="plan-select"
              className="text-sm font-medium text-gray-700"
            >
              Select Plan:
            </label>
            <select
              id="plan-select"
              value={selectedPlanId}
              onChange={(e) => setSelectedPlanId(e.target.value)}
              className="flex-1 max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {plans.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Charts */}
      {activeTab === "bar" && selectedPlan && barData.length > 0 && (
        <div className="h-[500px] px-4 pb-4">
          <h3 className="text-lg font-semibold mb-2">
            Savings Breakdown Over Time
          </h3>
          <div className="h-[calc(100%-2.5rem)]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 40, right: 20, bottom: 60, left: 80 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200"
                />
                <XAxis
                  dataKey="age"
                  label={{ value: "Age", position: "bottom", offset: 10 }}
                  className="text-slate-600"
                />
                <YAxis
                  label={{
                    value: "Amount ($)",
                    angle: -90,
                    position: "left",
                  }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) {
                      return `$${(value / 1000000).toFixed(1)}M`;
                    } else if (value >= 1000) {
                      return `$${(value / 1000).toFixed(0)}k`;
                    } else {
                      return `$${value.toFixed(0)}`;
                    }
                  }}
                  width={80}
                />
                <Tooltip content={<BarTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="employeeContribution"
                  stackId="a"
                  fill="#4f46e5"
                  name="Employee Contribution"
                />
                <Bar
                  dataKey="employerContribution"
                  stackId="a"
                  fill="#10b981"
                  name="Employer Contribution"
                />
                <Bar
                  dataKey="growth"
                  stackId="a"
                  fill="#f59e0b"
                  name="Growth"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "line" && (
        <div className="h-[500px] px-4 pb-4">
          <h3 className="text-lg font-semibold mb-2">Retirement Projection</h3>
          <div className="h-[calc(100%-2.5rem)]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 40, right: 20, bottom: 60, left: 80 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200"
                />
                <XAxis
                  dataKey="age"
                  label={{ value: "Age", position: "bottom", offset: 10 }}
                  className="text-slate-600"
                />
                <YAxis
                  label={{
                    value: "Account Balance ($)",
                    angle: -90,
                    position: "left",
                  }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) {
                      return `$${(value / 1000000).toFixed(1)}M`;
                    } else if (value >= 1000) {
                      return `$${(value / 1000).toFixed(0)}k`;
                    } else {
                      return `$${value.toFixed(0)}`;
                    }
                  }}
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} />
                {plans.map(
                  (plan, index) =>
                    visiblePlans.has(plan.id) && (
                      <Line
                        key={plan.id}
                        type="monotone"
                        dataKey={plan.id}
                        stroke={COLORS[index % COLORS.length]}
                        dot={false}
                        name={plan.name}
                      />
                    )
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChartsPanel;
