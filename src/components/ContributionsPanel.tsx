import type { Contribution } from "../types/types";
import { SummaryCard } from "./ui";
import { formatCurrency } from "../utils/util";

interface ContributionsPanelProps {
  contributions: Contribution[];
}

export const ContributionsPanel = ({
  contributions,
}: ContributionsPanelProps) => {
  const totalContributions = contributions.reduce(
    (acc, contribution) =>
      acc + contribution.employeeContribution + contribution.employerMatch,
    0
  );
  const totalEmployeeContributions = contributions.reduce(
    (acc, contribution) => acc + contribution.employeeContribution,
    0
  );
  const totalEmployerContributions = contributions.reduce(
    (acc, contribution) => acc + contribution.employerMatch,
    0
  );

  const ytdContributions = contributions.filter(
    (contribution) =>
      contribution.date.getFullYear() === new Date().getFullYear()
  );
  const ytdEmployeeContributions = ytdContributions.reduce(
    (acc, contribution) => acc + contribution.employeeContribution,
    0
  );
  const ytdEmployerContributions = ytdContributions.reduce(
    (acc, contribution) => acc + contribution.employerMatch,
    0
  );
  const totalYtdContributions =
    ytdEmployeeContributions + ytdEmployerContributions;

  return (
    <div className="flex flex-col gap-4 rounded-xl border shadow-md bg-slate-100 p-4 h-full overflow-y-auto">
      {/* Summary Cards */}
      <div>
        <h2 className="text-xl font-bold mb-1 text-black">
          Total Contributions
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard
          label="Your Total Contributions"
          value={totalEmployeeContributions}
          variant="blue"
        />
        <SummaryCard
          label="Total Employer Contributions"
          value={totalEmployerContributions}
          variant="green"
        />
        <SummaryCard
          label="Total Contributions"
          value={totalContributions}
          variant="red"
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-1 text-black">
          Year-to-Date Contributions
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <SummaryCard
          label="Your YTD Contributions"
          value={ytdEmployeeContributions}
          variant="blue"
        />
        <SummaryCard
          label="YTD Employer Contributions"
          value={ytdEmployerContributions}
          variant="green"
        />
        <SummaryCard
          label="YTD Contributions"
          value={totalYtdContributions}
          variant="red"
        />
      </div>

      {/* Contribution History */}
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">
          Contribution History
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {contributions.map((c, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 text-left">
                  {c.date.toLocaleDateString()}
                </p>
                <div className="flex gap-3 mt-1.5">
                  <span className="text-xs text-gray-600">
                    You:{" "}
                    <span className="font-medium">
                      {formatCurrency(c.employeeContribution)}
                    </span>
                  </span>
                  <span className="text-xs text-gray-600">
                    Employer:{" "}
                    <span className="font-medium">
                      {formatCurrency(c.employerMatch)}
                    </span>
                  </span>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-900 ml-4">
                {formatCurrency(c.employeeContribution + c.employerMatch)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
