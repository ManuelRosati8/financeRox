// ============================================================
// PROJECTION ALGORITHM — financeRox
// Pure financial projection based on recurring transactions
// and 3-month average of variable expenses.
// ============================================================

import { Transaction, SavingsGoal, ProjectionPoint, WhatIfScenario } from "@/lib/types";
import { addMonths, format, isWithinInterval, parseISO } from "date-fns";
import { it } from "date-fns/locale";

/**
 * Monthly amount for a recurring transaction based on its interval.
 */
function toMonthlyAmount(amount: number, interval: string): number {
  switch (interval) {
    case "daily":   return amount * 30;
    case "weekly":  return amount * 4.33;
    case "monthly": return amount;
    case "yearly":  return amount / 12;
    default:        return amount;
  }
}

/**
 * Compute the 3-month average of variable (non-recurring) expenses.
 */
function avgVariableExpenses(transactions: Transaction[]): number {
  const now = new Date();
  const threeMonthsAgo = addMonths(now, -3);

  const variable = transactions.filter(
    (t) =>
      t.type === "expense" &&
      !t.is_recurring &&
      isWithinInterval(parseISO(t.date), { start: threeMonthsAgo, end: now })
  );

  const total = variable.reduce((sum, t) => sum + t.amount, 0);
  return total / 3; // monthly average
}

/**
 * Compute baseline current balance from all transactions.
 */
function computeCurrentBalance(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.status === 'confirmed')
    .reduce((sum, t) => {
      return t.type === "income" ? sum + t.amount : sum - t.amount;
    }, 0);
}

/**
 * Main projection function.
 * Returns month-by-month balance projection for `months` months ahead.
 * Optionally includes a whatIf scenario that adds/subtracts a monthly delta.
 */
export function computeProjection(
  transactions: Transaction[],
  _goals: SavingsGoal[],
  months: number,
  whatIf?: WhatIfScenario
): ProjectionPoint[] {
  const now = new Date();
  
  let monthlyRecurringNet = 0;
  // Group recurring by description to avoid summing all historical instances of the same stream
  const recurringMap = new Map<string, Transaction>();
  transactions.filter((t) => t.is_recurring && t.interval).forEach(t => {
    if (!recurringMap.has(t.description)) {
      recurringMap.set(t.description, t);
    }
  });

  Array.from(recurringMap.values()).forEach((t) => {
    const monthly = toMonthlyAmount(t.amount, t.interval!);
    monthlyRecurringNet += t.type === "income" ? monthly : -monthly;
  });

  // Variable monthly average
  const monthlyVariableExpenses = avgVariableExpenses(transactions);

  // Net monthly delta
  const monthlyDelta = monthlyRecurringNet - monthlyVariableExpenses;

  // Current balance as starting point
  const currentBalance = computeCurrentBalance(transactions);

  // What-if monthly delta
  const whatIfMonthlyDelta = whatIf
    ? (() => {
        const m = toMonthlyAmount(whatIf.amount, whatIf.interval);
        return whatIf.type === "income" ? m : -m;
      })()
    : 0;

  // Generate projection points
  const points: ProjectionPoint[] = [];
  for (let i = 1; i <= months; i++) {
    const targetDate = addMonths(now, i);
    const label = format(targetDate, "MMM yyyy", { locale: it });
    const balance = currentBalance + monthlyDelta * i;
    const whatIfBalance = balance + whatIfMonthlyDelta * i;

    points.push({
      month: label,
      balance: Math.round(balance * 100) / 100,
      ...(whatIf !== undefined && { whatIfBalance: Math.round(whatIfBalance * 100) / 100 }),
    });
  }

  return points;
}

/**
 * Compute milestone snapshots for 6, 12, 24, 36 months.
 */
export function computeMilestones(
  transactions: Transaction[],
  goals: SavingsGoal[],
  whatIf?: WhatIfScenario
): { months: number; balance: number; whatIfBalance?: number }[] {
  const full = computeProjection(transactions, goals, 36, whatIf);
  return [
    { months: 6,  ...extractPoint(full, 6,  whatIf) },
    { months: 12, ...extractPoint(full, 12, whatIf) },
    { months: 24, ...extractPoint(full, 24, whatIf) },
    { months: 36, ...extractPoint(full, 36, whatIf) },
  ];
}

function extractPoint(
  points: ProjectionPoint[],
  month: number,
  whatIf?: WhatIfScenario
): { balance: number; whatIfBalance?: number } {
  const p = points[month - 1];
  if (!p) return { balance: 0 };
  return {
    balance: p.balance,
    ...(whatIf !== undefined && { whatIfBalance: p.whatIfBalance }),
  };
}
