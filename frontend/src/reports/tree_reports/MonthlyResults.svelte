<script lang="ts">
  import { is_non_empty } from "../../lib/array.ts";
  import IntervalTreeTable from "../../tree-table/IntervalTreeTable.svelte";
  import type { MonthlyResultsProps } from "./index.ts";

  let {
    dates,
    income_trees,
    expense_trees,
    asset_trees,
    liability_trees,
  }: MonthlyResultsProps = $props();
</script>

<h2>Income</h2>
{#if is_non_empty(income_trees)}
  <IntervalTreeTable
    trees={income_trees}
    {dates}
    budgets={{}}
    accumulate={false}
  />
{/if}

<h2>Expenses</h2>
{#if is_non_empty(expense_trees)}
  <IntervalTreeTable
    trees={expense_trees}
    {dates}
    budgets={{}}
    accumulate={false}
  />
{/if}

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
