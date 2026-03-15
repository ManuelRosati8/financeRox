export type TransactionType = "income" | "expense";
export type RecurringInterval = "daily" | "weekly" | "monthly" | "yearly";

export interface Category {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  is_default: boolean;
}

export interface Transaction {
  id: string;
  user_id: string;
  category_id: string | null;
  category?: Category;
  amount: number;
  description: string;
  date: string; // ISO date string "YYYY-MM-DD"
  type: TransactionType;
  is_recurring: boolean;
  interval: RecurringInterval | null;
  recurring_end: string | null;
  status: 'confirmed' | 'planned';
  created_at: string;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  notes: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  currency: string;
  avatar_url: string | null;
}

export interface ProjectionPoint {
  month: string; // "Gen 2025"
  balance: number;
  whatIfBalance?: number;
}

export interface WhatIfScenario {
  amount: number;
  type: TransactionType;
  interval: RecurringInterval;
  description: string;
}
