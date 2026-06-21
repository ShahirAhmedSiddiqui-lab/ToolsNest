import { Receipt, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Breadcrumbs } from "../components/Breadcrumbs";

type ExpenseItem = {
  id: number;
  description: string;
  category: string;
  amount: number;
  date: string;
};

const categories = ["Software", "Travel", "Meals", "Office", "Marketing", "Other"] as const;
const formatMoney = (value: number) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(value || 0);

export const Expenses = () => {
  const [items, setItems] = useState<ExpenseItem[]>([
    { id: 1, description: "", category: "Other", amount: 0, date: new Date().toISOString().slice(0, 10) },
  ]);

  const updateItem = (id: number, patch: Partial<ExpenseItem>) => {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const addItem = () => {
    setItems((current) => [
      ...current,
      { id: Date.now(), description: "", category: "Other", amount: 0, date: new Date().toISOString().slice(0, 10) },
    ]);
  };

  const removeItem = (id: number) => {
    setItems((current) => (current.length === 1 ? current : current.filter((item) => item.id !== id)));
  };

  const total = useMemo(() => items.reduce((sum, item) => sum + item.amount, 0), [items]);
  const grouped = useMemo(() => {
    return categories
      .map((category) => ({
        category,
        total: items.filter((item) => item.category === category).reduce((sum, item) => sum + item.amount, 0),
      }))
      .filter((entry) => entry.total > 0);
  }, [items]);

  return (
    <div className="flex-1 w-full px-margin-mobile md:px-margin-desktop py-8 lg:py-12">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs />

        <header className="mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-heading-navy">
            <Receipt className="h-8 w-8 text-primary" />
            Expenses
          </h1>
          <p className="mt-2 text-on-surface-variant">
            Track expense entries locally with instant totals and category breakdowns.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <section className="rounded-2xl border border-border-slate bg-surface-container-lowest p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-heading-navy">Expense entries</h2>
              <button type="button" onClick={addItem} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-slate px-4 font-medium">
                <Plus className="h-4 w-4" />
                Add expense
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="grid gap-3 rounded-xl border border-border-slate p-4 md:grid-cols-[minmax(0,1.5fr)_180px_130px_160px_44px]">
                  <input
                    value={item.description}
                    onChange={(event) => updateItem(item.id, { description: event.target.value })}
                    placeholder="Expense description"
                    className="min-h-11 rounded-lg border border-border-slate px-3"
                  />
                  <select
                    value={item.category}
                    onChange={(event) => updateItem(item.id, { category: event.target.value })}
                    className="min-h-11 rounded-lg border border-border-slate px-3"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.amount}
                    onChange={(event) => updateItem(item.id, { amount: Number(event.target.value) })}
                    className="min-h-11 rounded-lg border border-border-slate px-3"
                  />
                  <input
                    type="date"
                    value={item.date}
                    onChange={(event) => updateItem(item.id, { date: event.target.value })}
                    className="min-h-11 rounded-lg border border-border-slate px-3"
                  />
                  <button
                    type="button"
                    aria-label="Remove expense"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="flex min-h-11 items-center justify-center rounded-lg text-error disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-border-slate bg-surface-container-lowest p-6">
            <h2 className="text-lg font-bold text-heading-navy">Summary</h2>
            <div className="mt-4 rounded-xl bg-surface-container-low p-5">
              <p className="text-sm text-on-surface-variant">Total expenses</p>
              <p className="mt-2 text-3xl font-bold text-heading-navy">{formatMoney(total)}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant">By category</h3>
              {grouped.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {grouped.map((entry) => (
                    <div key={entry.category} className="flex items-center justify-between rounded-lg border border-border-slate px-4 py-3">
                      <span className="text-heading-navy">{entry.category}</span>
                      <span className="font-semibold text-heading-navy">{formatMoney(entry.total)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 rounded-lg border border-dashed border-border-slate bg-surface/40 p-4 text-sm text-on-surface-variant">
                  Add real expense amounts to see category totals.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
