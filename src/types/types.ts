export interface Contribution {
    id: string;
    employeeContribution: number;
    employerMatch: number;
    payPeriod: number;
    date: Date;
}

export interface SavingsPlan {
    id: string;
    name: string;
    currentBalance: number;
    annualSalary: number;
    currentAge: number;
    retirementAge: number;
    contributionType: 'percentage' | 'fixed';
    contributionAmountFixed: number;
    contributionAmountPercentage: number;
    matchRate: number;
    expectedReturn: number;
}

export interface DataPoint {
    age: number;
    [key: string]: number;
  }