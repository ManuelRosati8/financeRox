"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Transaction, Category, SavingsGoal, Profile } from "@/lib/types";

// Helper to get current user ID
async function getUserId(supabase: ReturnType<typeof createClient>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  return user.id;
}

// ============================================================
// TRANSACTIONS
// ============================================================
export function useTransactions() {
  const supabase = createClient();
  return useQuery<Transaction[]>({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          category:categories(*)
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      return (data || []) as any as Transaction[];
    },
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  const supabase = createClient();
  return useMutation({
    mutationFn: async (data: Omit<Transaction, "id" | "user_id" | "created_at" | "category">) => {
      const user_id = await getUserId(supabase);
      const { data: result, error } = await supabase
        .from('transactions')
        .insert({ ...data, user_id })
        .select('*, category:categories(*)')
        .single();
        
      if (error) throw error;
      return result as any as Transaction;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

export function useUpdateTransaction() {
  const qc = useQueryClient();
  const supabase = createClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Transaction> & { id: string }) => {
      // Removing 'category' if it was accidentally passed (it's a joined relation)
      const { category, ...updatePayload } = data as any;
      const { error } = await supabase
        .from('transactions')
        .update(updatePayload)
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  const supabase = createClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });
}

// ============================================================
// CATEGORIES
// ============================================================
export function useCategories(type?: "income" | "expense") {
  const supabase = createClient();
  return useQuery<Category[]>({
    queryKey: ["categories", type],
    queryFn: async () => {
      let query = supabase.from('categories').select('*');
      if (type) query = query.eq('type', type);
      
      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Category[];
    },
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  const supabase = createClient();
  return useMutation({
    mutationFn: async (data: Omit<Category, "id" | "user_id" | "created_at">) => {
      const user_id = await getUserId(supabase);
      const { data: result, error } = await supabase
        .from('categories')
        .insert({ ...data, user_id })
        .select('*')
        .single();
        
      if (error) throw error;
      return result as Category;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

// ============================================================
// SAVINGS GOALS
// ============================================================
export function useSavingsGoals() {
  const supabase = createClient();
  return useQuery<SavingsGoal[]>({
    queryKey: ["savings_goals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*');
        
      if (error) throw error;
      return (data || []) as SavingsGoal[];
    },
  });
}

export function useCreateSavingsGoal() {
  const qc = useQueryClient();
  const supabase = createClient();
  return useMutation({
    mutationFn: async (data: Omit<SavingsGoal, "id" | "user_id" | "created_at" | "updated_at">) => {
      const user_id = await getUserId(supabase);
      const { data: result, error } = await supabase
        .from('savings_goals')
        .insert({ ...data, user_id })
        .select('*')
        .single();
        
      if (error) throw error;
      return result as SavingsGoal;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["savings_goals"] }),
  });
}

export function useUpdateSavingsGoal() {
  const qc = useQueryClient();
  const supabase = createClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<SavingsGoal> & { id: string }) => {
      const { error } = await supabase
        .from('savings_goals')
        .update(data)
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["savings_goals"] }),
  });
}

export function useDeleteSavingsGoal() {
  const qc = useQueryClient();
  const supabase = createClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["savings_goals"] }),
  });
}

// ============================================================
// PROFILE
// ============================================================
export function useProfile() {
  const supabase = createClient();
  return useQuery<Profile | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      return data as Profile;
    },
  });
}

// ============================================================
// SUBSCRIPTION
// TESTING MODE: All PRO features unlocked. Re-enable Stripe
// by wiring this hook to a real webhook-verified DB column.
// ============================================================
export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: async () => ({ isPro: true, plan: "PRO" }),
  });
};
