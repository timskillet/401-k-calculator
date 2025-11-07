import type { SavingsPlan, DataPoint } from "../types/types";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export { formatCurrency };

// Calculate total contributions and projected savings based on current form inputs
export const calculateOutput = (plan: SavingsPlan) => {
  // Validate that we have minimum required inputs
  if (
    plan.currentAge === 0 ||
    plan.retirementAge === 0 ||
    plan.retirementAge <= plan.currentAge ||
    plan.annualSalary === 0 ||
    (plan.contributionType === "percentage" &&
      plan.contributionAmountPercentage === 0) ||
    (plan.contributionType === "fixed" && plan.contributionAmountFixed === 0)
  ) {
    return { totalContributions: 0, projectedSavings: 0 };
  }

  const yearsToRetirement = plan.retirementAge - plan.currentAge;
  let balance = plan.currentBalance;
  let totalEmployeeContributions = 0;
  let totalEmployerContributions = 0;

  for (let year = 0; year < yearsToRetirement; year++) {
    const yearContribution =
      plan.contributionType === "percentage"
        ? (plan.annualSalary * plan.contributionAmountPercentage) / 100
        : plan.contributionAmountFixed * 12;

    const yearMatchableRate =
      plan.contributionType === "percentage"
        ? plan.contributionAmountPercentage / 100
        : (plan.contributionAmountFixed * 12) / plan.annualSalary;

    const yearMatch = (plan.annualSalary * yearMatchableRate * plan.matchRate) / 100;

    totalEmployeeContributions += yearContribution;
    totalEmployerContributions += yearMatch;

    balance =
      (balance + yearContribution + yearMatch) * (1 + plan.expectedReturn / 100);
  }

  return {
    totalContributions: Math.round(
      totalEmployeeContributions + totalEmployerContributions
    ),
    projectedSavings: Math.round(balance),
  };
};

export const calculateProjectionData = (
    plans: SavingsPlan[],
    visiblePlans: Set<string>
  ) => {
    if (plans.length === 0) return [];
  
    const dataPoints: DataPoint[] = [];
    const minAge = Math.min(...plans.map((plan) => plan.currentAge));
    const maxAge = Math.max(...plans.map((plan) => plan.retirementAge));
  
    // Initialize balances for each plan - track balance as we iterate through ages
    const planBalances = new Map<string, number>();
    const planSalaries = new Map<string, number>();
    
    plans.forEach((plan) => {
      if (visiblePlans.has(plan.id)) {
        planBalances.set(plan.id, plan.currentBalance);
        planSalaries.set(plan.id, plan.annualSalary);
      }
    });
  
    for (let age = minAge; age <= maxAge; age++) {
      const point: DataPoint = { age };
  
      plans.forEach((plan) => {
        if (!visiblePlans.has(plan.id)) {
          point[plan.id] = 0;
          return;
        }
  
        const yearsFromStart = age - plan.currentAge;
        if (
          yearsFromStart < 0 ||
          yearsFromStart > plan.retirementAge - plan.currentAge
        ) {
          point[plan.id] = 0;
          return;
        }
  
        let balance = planBalances.get(plan.id) ?? plan.currentBalance;
        let currentSalary = planSalaries.get(plan.id) ?? plan.annualSalary;
  
        if (yearsFromStart > 0) {
          const yearContribution =
            plan.contributionType === "percentage"
              ? (currentSalary * plan.contributionAmountPercentage) / 100
              : plan.contributionAmountFixed * 12;
  
          const yearMatchableRate =
            plan.contributionType === "percentage"
              ? plan.contributionAmountPercentage / 100
              : (plan.contributionAmountFixed * 12) / currentSalary;
  
          const yearMatch =
            (currentSalary * yearMatchableRate * plan.matchRate) / 100;
          
          balance = (balance + yearContribution + yearMatch) * (1 + plan.expectedReturn / 100);
          planBalances.set(plan.id, balance);
        } else {
          planBalances.set(plan.id, balance);
        }
        
        point[plan.id] = Math.round(balance);
      });
      dataPoints.push(point);
    }
    return dataPoints;
  };

export const calculateStackedBarData = (
    plans: SavingsPlan[],
    visiblePlans: Set<string>
  ) => {
    if (plans.length === 0) return [];
  
    // Get the first visible plan, or combine all visible plans
    const visiblePlanList = plans.filter((plan) => visiblePlans.has(plan.id));
    if (visiblePlanList.length === 0) return [];
  
    // For simplicity, use the first visible plan
    // You could also aggregate all visible plans
    const plan = visiblePlanList[0];
    const yearsToRetirement = plan.retirementAge - plan.currentAge;
    const barData: Array<{
      year: number;
      age: number;
      employeeContribution: number;
      employerContribution: number;
      growth: number;
      totalBalance: number;
    }> = [];
  
    let balance = plan.currentBalance;
    let totalEmployeeContributions = 0;
    let totalEmployerContributions = 0;
    let totalGrowth = 0;
  
    for (let year = 0; year <= yearsToRetirement; year++) {
      const currentAge = plan.currentAge + year;
  
      if (year === 0) {
        // Initial state - no contributions or growth yet
        barData.push({
          year: 1,
          age: currentAge,
          employeeContribution: 0,
          employerContribution: 0,
          growth: 0,
          totalBalance: Math.round(balance),
        });
        continue;
      }
  
      const yearContribution =
        plan.contributionType === "percentage"
          ? (plan.annualSalary * plan.contributionAmountPercentage) / 100
          : plan.contributionAmountFixed * 26;
  
      const yearMatchableRate =
        plan.contributionType === "percentage"
          ? plan.contributionAmountPercentage / 100
          : (plan.contributionAmountFixed * 26) / plan.annualSalary;
  
      const yearMatch =
        (plan.annualSalary * yearMatchableRate * plan.matchRate) / 100;
  
      // Add contributions first, then calculate growth on the total (compound interest)
      const balanceBeforeGrowth = balance + yearContribution + yearMatch;
      const yearGrowth = balanceBeforeGrowth * (plan.expectedReturn / 100);
      
      // Update balance with compound interest
      balance = balanceBeforeGrowth + yearGrowth;
  
      // Track cumulative amounts
      totalEmployeeContributions += yearContribution;
      totalEmployerContributions += yearMatch;
      totalGrowth += yearGrowth;
  
      barData.push({
        year: year + 1,
        age: currentAge,
        employeeContribution: Math.round(totalEmployeeContributions),
        employerContribution: Math.round(totalEmployerContributions),
        growth: Math.round(totalGrowth),
        totalBalance: Math.round(balance),
      });
    }
  
    return barData;
  };