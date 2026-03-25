<script lang="ts">
  import type { AccountTreeNode } from "../../charts/hierarchy.ts";
  import { is_non_empty } from "../../lib/array.ts";
  import { ctx } from "../../stores/format.ts";
  import { operating_currency } from "../../stores/options.ts";
  import IntervalTreeTable from "../../tree-table/IntervalTreeTable.svelte";
  import type { MonthlyResultsProps } from "./index.ts";

  let {
    dates,
    income_trees,
    expense_trees,
    asset_trees,
    liability_trees,
  }: MonthlyResultsProps = $props();

  function negate_record(r: Record<string, number>): Record<string, number> {
    return Object.fromEntries(Object.entries(r).map(([k, v]) => [k, -v]));
  }

  function negate_tree(node: AccountTreeNode): AccountTreeNode {
    return {
      ...node,
      balance: negate_record(node.balance),
      balance_children: negate_record(node.balance_children),
      children: node.children.map(negate_tree),
    };
  }

  function add_records(
    a: Record<string, number>,
    b: Record<string, number>,
  ): Record<string, number> {
    const result = { ...a };
    for (const [k, v] of Object.entries(b)) {
      result[k] = (result[k] ?? 0) + v;
    }
    return result;
  }

  function avg_records(
    records: Record<string, number>[],
  ): Record<string, number> {
    const result: Record<string, number> = {};
    const count = records.length;
    if (count === 0) {
      return result;
    }
    for (const r of records) {
      for (const [k, v] of Object.entries(r)) {
        result[k] = (result[k] ?? 0) + v;
      }
    }
    for (const k of Object.keys(result)) {
      result[k] /= count;
    }
    return result;
  }

  const negated_income = $derived(income_trees.map(negate_tree));
  const negated_expenses = $derived(expense_trees.map(negate_tree));

  // Results = negated income + negated expenses per month (both negative in Beancount → flip)
  const results_per_month = $derived(
    negated_income.map((t, i) =>
      add_records(
        t.balance_children,
        negated_expenses[i]?.balance_children ?? {},
      ),
    ),
  );

  // Net Worth = assets + liabilities (liabilities are stored negative in Beancount)
  const net_worth_per_month = $derived(
    asset_trees.map((t, i) =>
      add_records(
        t.balance_children,
        liability_trees[i]?.balance_children ?? {},
      ),
    ),
  );

  const avg_results = $derived(avg_records(results_per_month));
  const avg_net_worth = $derived(avg_records(net_worth_per_month));

  function format_amount(currency: string, value: number): string {
    return $operating_currency.includes(currency)
      ? $ctx.num(value, currency)
      : $ctx.amount(value, currency);
  }
</script>

<h2>Income</h2>
{#if is_non_empty(negated_income)}
  <IntervalTreeTable
    trees={negated_income}
    {dates}
    budgets={{}}
    accumulate={false}
  />
{/if}

<h2>Expenses</h2>
{#if is_non_empty(negated_expenses)}
  <IntervalTreeTable
    trees={negated_expenses}
    {dates}
    budgets={{}}
    accumulate={false}
  />
{/if}

<ol class="flex-table tree-table-new summary-section">
  <li>
    <p>
      <span class="label">Results</span>
      <span class="num other avg-col">
        {#each Object.entries(avg_results) as [currency, value] (currency)}
          {format_amount(currency, value)}<br />
        {/each}
      </span>
      {#each results_per_month as amounts, i (i)}
        <span class="num other">
          {#each Object.entries(amounts) as [currency, value] (currency)}
            {format_amount(currency, value)}<br />
          {/each}
        </span>
      {/each}
    </p>
  </li>
</ol>

<h2>Assets</h2>
{#if is_non_empty(asset_trees)}
  <IntervalTreeTable
    trees={asset_trees}
    {dates}
    budgets={{}}
    accumulate={true}
  />
{/if}

<h2>Liabilities</h2>
{#if is_non_empty(liability_trees)}
  <IntervalTreeTable
    trees={liability_trees}
    {dates}
    budgets={{}}
    accumulate={true}
  />
{/if}

<ol class="flex-table tree-table-new summary-section">
  <li>
    <p>
      <span class="label">Net Worth</span>
      <span class="num other avg-col">
        {#each Object.entries(avg_net_worth) as [currency, value] (currency)}
          {format_amount(currency, value)}<br />
        {/each}
      </span>
      {#each net_worth_per_month as amounts, i (i)}
        <span class="num other">
          {#each Object.entries(amounts) as [currency, value] (currency)}
            {format_amount(currency, value)}<br />
          {/each}
        </span>
      {/each}
    </p>
  </li>
</ol>

<style>
  .summary-section {
    margin-bottom: 1.5em;
  }

  .summary-section li p {
    font-weight: bold;
    border-top: 2px solid var(--table-border);
  }

  .label {
    flex: 1;
    min-width: 14em;
    max-width: 30em;
  }
</style>
