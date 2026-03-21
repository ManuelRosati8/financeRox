"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Filter, Edit2, Trash2, ArrowUpRight, ArrowDownRight, RefreshCw, CheckSquare, Square, ChevronUp, ChevronDown, Tag } from "lucide-react";
import { useTransactions, useDeleteTransaction, useCategories } from "@/lib/supabase/hooks";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MoneyValue } from "@/components/ui/MoneyValue";
import { TransactionDialog } from "@/components/transactions/TransactionDialog";
import { Transaction } from "@/lib/types";
import { useI18n } from "@/lib/i18n/context";

export default function TransactionsPage() {
  const { data: transactions = [], isLoading } = useTransactions();
  const { data: categories = [] } = useCategories();
  const deleteTx = useDeleteTransaction();
  const { t } = useI18n();

  const [search, setSearch]       = useState("");
  const [typeFilter, setType]     = useState<"all" | "income" | "expense">("all");
  const [catFilter, setCat]       = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("");
  const [dialogOpen, setDialog]   = useState(false);
  const [editing, setEditing]     = useState<Transaction | null>(null);
  const [deleting, setDeleting]   = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: "asc" | "desc" } | null>({ key: "date", direction: "desc" });

  const filtered = useMemo(() => {
    let result = transactions.filter((t) => {
      const matchSearch = !search || t.description.toLowerCase().includes(search.toLowerCase());
      const matchType   = typeFilter === "all" || t.type === typeFilter;
      const matchCat    = catFilter === "all"  || t.category_id === catFilter;
      const matchTag    = !tagFilter || t.description.toLowerCase().includes(tagFilter.toLowerCase());
      return matchSearch && matchType && matchCat && matchTag;
    });

    if (sortConfig) {
      result.sort((a, b) => {
        let valA: string | number = "";
        let valB: string | number = "";
        
        if (sortConfig.key === "date") { valA = a.date; valB = b.date; }
        else if (sortConfig.key === "amount") { valA = a.amount; valB = b.amount; }
        else if (sortConfig.key === "description") { valA = a.description.toLowerCase(); valB = b.description.toLowerCase(); }
        else if (sortConfig.key === "type") { valA = a.type; valB = b.type; }
        else if (sortConfig.key === "category") { 
          valA = categories.find(c => c.id === a.category_id)?.name.toLowerCase() || "";
          valB = categories.find(c => c.id === b.category_id)?.name.toLowerCase() || "";
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [transactions, search, typeFilter, catFilter, sortConfig, categories]);

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        if (current.direction === "asc") return { key, direction: "desc" };
        return null;
      }
      return { key, direction: "asc" };
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("transactions.deleteConfirm"))) return;
    setDeleting(id);
    await deleteTx.mutateAsync(id);
    setDeleting(null);
    setSelectedIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const handleBulkDelete = async () => {
    if (!confirm(t("transactions.deleteBulkConfirm", { count: selectedIds.size }))) return;
    setBulkDeleting(true);
    await Promise.all(Array.from(selectedIds).map(id => deleteTx.mutateAsync(id)));
    setBulkDeleting(false);
    setSelectedIds(new Set());
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length && filtered.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(t => t.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  if (isLoading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
      <div style={{ color: "var(--text-muted)" }}>{t("common.loadingTransactions")}</div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div className="header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700 }}>{t("transactions.title")}</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: 4 }}>
            {t("transactions.total", { n: transactions.length })}
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setDialog(true); }}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "10px 18px", borderRadius: 10, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, var(--accent), var(--accent-hover))",
            color: "white", fontSize: 14, fontWeight: 600,
            boxShadow: "0 4px 20px rgba(124,111,247,0.35)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
          onMouseOver={e => (e.currentTarget.style.transform = "translateY(-1px)")}
          onMouseOut={e => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <Plus size={16} />
          {t("transactions.addNew")}
        </button>
      </div>

      {/* Filters */}
      <div className="glass filter-row" style={{ padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 200px", minWidth: 200 }}>
          <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("transactions.search")}
            style={{
              width: "100%", paddingLeft: 36, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
              background: "var(--bg-subtle)", border: "1px solid var(--border-subtle)",
              borderRadius: 8, color: "var(--text-primary)", fontSize: 13, outline: "none",
            }}
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setType(e.target.value as "all" | "income" | "expense")}
          style={{
            padding: "8px 12px", background: "var(--bg-subtle)",
            border: "1px solid var(--border-subtle)", borderRadius: 8,
            color: "var(--text-primary)", fontSize: 13, cursor: "pointer", outline: "none",
          }}
        >
          <option value="all">{t("transactions.allTypes")}</option>
          <option value="income">{t("transactions.income")}</option>
          <option value="expense">{t("transactions.expense")}</option>
        </select>

        <select
          value={catFilter}
          onChange={(e) => setCat(e.target.value)}
          style={{
            padding: "8px 12px", background: "var(--bg-subtle)",
            border: "1px solid var(--border-subtle)", borderRadius: 8,
            color: "var(--text-primary)", fontSize: 13, cursor: "pointer", outline: "none",
          }}
        >
          <option value="all">{t("transactions.allCategories")}</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <div style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
          <Filter size={13} style={{ display: "inline", marginRight: 4 }} />
          {filtered.length} {t("transactions.results")}
        </div>

        {/* Tag filter */}
        {tagFilter && (
          <button
            onClick={() => setTagFilter("")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "5px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600,
              background: "rgba(139,92,246,0.15)", color: "#a78bfa",
              border: "1px solid rgba(139,92,246,0.3)", cursor: "pointer",
            }}
          >
            <Tag size={11} />
            {tagFilter} &times;
          </button>
        )}
      </div>

      {/* Table — desktop */}
      <div className="glass table-wrap tx-table-wrap" style={{ overflow: "hidden", width: "100%" }}>
        <div style={{ overflowX: "auto", width: "100%" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <th style={{ padding: "14px 16px", width: 40, textAlign: "center" }}>
                  <button onClick={toggleSelectAll} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                    {filtered.length > 0 && selectedIds.size === filtered.length ? <CheckSquare size={16} color="var(--accent)" /> : <Square size={16} />}
                  </button>
                </th>
                {[
                  { label: t("transactions.date"), key: "date" },
                  { label: t("transactions.description"), key: "description" },
                  { label: t("transactions.category"), key: "category" },
                  { label: t("transactions.type"), key: "type" },
                  { label: t("transactions.amount"), key: "amount" }
                ].map((col) => (
                  <th 
                    key={col.key} 
                    onClick={() => handleSort(col.key)}
                    style={{
                      padding: "14px 16px", textAlign: col.key === "amount" ? "right" : "left",
                      fontSize: 11, fontWeight: 600, color: sortConfig?.key === col.key ? "var(--accent)" : "var(--text-muted)",
                      textTransform: "uppercase", letterSpacing: "0.07em", cursor: "pointer",
                      userSelect: "none", transition: "color 0.2s"
                    }}
                    onMouseOver={e => e.currentTarget.style.color = "var(--text-primary)"}
                    onMouseOut={e => e.currentTarget.style.color = sortConfig?.key === col.key ? "var(--accent)" : "var(--text-muted)"}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: col.key === "amount" ? "flex-end" : "flex-start", gap: 4 }}>
                      {col.label}
                      {sortConfig?.key === col.key && (
                        sortConfig.direction === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                      )}
                    </div>
                  </th>
                ))}
                <th style={{ padding: "14px 16px" }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx, i) => {
                const isSelected = selectedIds.has(tx.id);
                return (
                <tr
                  key={tx.id}
                  style={{
                    borderBottom: "1px solid var(--border-subtle)",
                    background: isSelected ? "var(--bg-subtle)" : "transparent",
                    transition: "background 0.12s",
                    opacity: tx.status === 'planned' ? 0.65 : 1,
                  }}
                  onMouseOver={e => (!isSelected && (e.currentTarget.style.background = "rgba(255,255,255,0.025)"))}
                  onMouseOut={e => (!isSelected && (e.currentTarget.style.background = "transparent"))}
                >
                  <td style={{ padding: "14px 16px", width: 40, textAlign: "center" }}>
                    <button onClick={() => toggleSelect(tx.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                      {isSelected ? <CheckSquare size={16} color="var(--accent)" /> : <Square size={16} />}
                    </button>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 12, color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace", whiteSpace: "nowrap" }}>
                    {formatDate(tx.date)}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>
                      {/* Description without hashtags */}
                      {tx.description.replace(/#[\w\u00C0-\u017F]+/g, "").trim() || tx.description}
                    </div>
                    {/* Smart Tag chips */}
                    {(() => {
                      const tagMatches = tx.description.match(/#[\w\u00C0-\u017F]+/g);
                      if (!tagMatches) return null;
                      return (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                          {tagMatches.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => setTagFilter(tag)}
                              title={`Filtra per ${tag}`}
                              style={{
                                padding: "2px 7px", borderRadius: 99,
                                fontSize: 11, fontWeight: 600, cursor: "pointer",
                                background: tagFilter === tag ? "rgba(139,92,246,0.3)" : "rgba(139,92,246,0.12)",
                                color: "#a78bfa",
                                border: "1px solid rgba(139,92,246,0.22)",
                              }}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      );
                    })()}
                    {tx.is_recurring && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                        <RefreshCw size={10} color="var(--accent-purple)" />
                        <span style={{ fontSize: 11, color: "var(--accent-purple)" }}>
                          {t("transactions.recurring")} · {tx.interval}
                        </span>
                      </div>
                    )}
                    {tx.status === 'planned' && (
                      <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, display: "flex", alignItems: "center", gap: 3 }}>
                        <CheckSquare size={10} /> {t("transactions.planned")}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    {tx.category && (
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "3px 10px", borderRadius: 99,
                        background: `${tx.category.color}22`,
                        color: tx.category.color, fontSize: 12, fontWeight: 500,
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: tx.category.color }} />
                        {tx.category.name}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 500,
                      ...(tx.type === "income"
                        ? { background: "rgba(16,185,129,0.12)", color: "var(--income-color)" }
                        : { background: "rgba(244,63,94,0.12)", color: "var(--expense-color)" }),
                    }}>
                      {tx.type === "income" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                      {tx.type === "income" ? t("transactions.incomeLabel") : t("transactions.expenseLabel")}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", textAlign: "right" }}>
                    <MoneyValue
                      amount={tx.amount}
                      color={tx.type === "income" ? "var(--income-color)" : "var(--expense-color)"}
                      prefix={tx.type === "income" ? "+" : "-"}
                    />
                  </td>
                  <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                      <button
                        onClick={() => { setEditing(tx); setDialog(true); }}
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4, borderRadius: 6 }}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(tx.id)}
                        disabled={deleting === tx.id}
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--expense-color)", opacity: deleting === tx.id ? 0.4 : 0.7, padding: 4, borderRadius: 6 }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                    {t("transactions.noResults")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards — mobile */}
      <div className="tx-cards-mobile">
        {filtered.map((tx) => {
          const category = categories.find(c => c.id === tx.category_id);
          const tagMatches = tx.description.match(/#[\w\u00C0-\u017F]+/g);
          const cleanDesc = tx.description.replace(/#[\w\u00C0-\u017F]+/g, "").trim() || tx.description;
          return (
            <div key={tx.id} className="tx-card">
              <div className="tx-card-row">
                <span className="tx-card-desc">{cleanDesc}</span>
                <span style={{
                  fontFamily: "JetBrains Mono, monospace", fontWeight: 700, fontSize: 14,
                  color: tx.type === "income" ? "var(--income-color)" : "var(--expense-color)",
                  whiteSpace: "nowrap",
                }}>
                  {tx.type === "income" ? "+" : "-"}{tx.amount.toLocaleString("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                </span>
              </div>
              <div className="tx-card-row">
                <span className="tx-card-meta">{tx.date}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {category && (
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "2px 8px", borderRadius: 99,
                      background: `${category.color}22`, color: category.color,
                      fontSize: 11, fontWeight: 500,
                    }}>
                      <span style={{ width: 5, height: 5, borderRadius: "50%", background: category.color }} />
                      {category.name}
                    </span>
                  )}
                  {tx.is_recurring && (
                    <RefreshCw size={11} color="var(--accent)" />
                  )}
                </div>
              </div>
              {tagMatches && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {tagMatches.map(tag => (
                    <button key={tag} type="button" onClick={() => setTagFilter(tag)}
                      style={{
                        padding: "2px 7px", borderRadius: 99, fontSize: 11, fontWeight: 600,
                        cursor: "pointer",
                        background: tagFilter === tag ? "rgba(139,92,246,0.3)" : "rgba(139,92,246,0.12)",
                        color: "#a78bfa", border: "1px solid rgba(139,92,246,0.22)",
                      }}>
                      {tag}
                    </button>
                  ))}
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 4 }}>
                <button onClick={() => { setEditing(tx); setDialog(true); }}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 6, borderRadius: 6 }}>
                  <Edit2 size={14} />
                </button>
                <button onClick={() => handleDelete(tx.id)} disabled={deleting === tx.id}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--expense-color)", opacity: deleting === tx.id ? 0.4 : 0.8, padding: 6, borderRadius: 6 }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="fade-up" style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: "var(--bg-elevated)", border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)", padding: "12px 24px", borderRadius: 99,
          display: "flex", alignItems: "center", gap: 24, zIndex: 100,
        }}>
          <span style={{ fontSize: 13, fontWeight: 600 }}>
            {t("transactions.selected", { count: selectedIds.size })}
          </span>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setSelectedIds(new Set())}
              style={{ background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: 13, fontWeight: 500, cursor: "pointer" }}
            >
              {t("transactions.cancelSelection")}
            </button>
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              style={{
                background: "rgba(244,63,94,0.12)", border: "none", color: "var(--expense-color)",
                padding: "8px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6, opacity: bulkDeleting ? 0.6 : 1,
              }}
            >
              <Trash2 size={14} />
              {bulkDeleting ? t("transactions.deleting") : t("transactions.deleteSelected")}
            </button>
          </div>
        </div>
      )}

      {/* Dialog */}
      <TransactionDialog
        open={dialogOpen}
        onClose={() => { setDialog(false); setEditing(null); }}
        initialData={editing}
      />
    </div>
  );
}
