<script lang="ts">
  import type { AccountBudget } from "../api/validators.ts";
  import type { AccountTreeNode } from "../charts/hierarchy.ts";
  import type { NonEmptyArray } from "../lib/array.ts";
  import { is_empty } from "../lib/objects.ts";
  import { toggled_accounts } from "../stores/accounts.ts";
  import { ctx } from "../stores/format.ts";
  import { currency_name } from "../stores/index.ts";
  import { operating_currency } from "../stores/options.ts";
  import AccountCell from "./AccountCell.svelte";
  import Diff from "./Diff.svelte";
  import { getTreeTableNotShownContext } from "./helpers.ts";
  import IntervalTreeTableNode from "./IntervalTreeTableNode.svelte";

  type Nodes = NonEmptyArray<AccountTreeNode>;

  interface Props {
    /** The account nodes to show. */
    nodes: Nodes;
    /** The budgets (per account a list per date range). */
    budgets: Record<string, AccountBudget[]>;
  }

  let { nodes, budgets }: Props = $props();

  const not_shown = getTreeTableNotShownContext();

  let [node] = $derived(nodes);
  let { account, children } = $derived(node);
  let account_budgets = $derived(budgets[account]);

  let is_toggled = $derived($toggled_accounts.has(account));

  const format_amount = (currency: string, number: number): string =>
    $operating_currency.includes(currency)
      ? $ctx.num(number, currency)
      : $ctx.amount(number, currency);

  let avg_balance = $derived.by(() => {
    const result: Record<string, number> = {};
    const count = nodes.length;
    if (count === 0) {
      return result;
    }
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const account_budget = account_budgets?.[i];
      const has_balance =
        !is_empty(n.balance) ||
        (account_budget != null && !is_empty(account_budget.budget));
      const show_balance = !is_toggled && has_balance;
      const bal = show_balance ? n.balance : n.balance_children;
      for (const [k, v] of Object.entries(bal)) {
        result[k] = (result[k] ?? 0) + v;
      }
    }
    for (const k of Object.keys(result)) {
      result[k] /= count;
    }
    return result;
  });
</script>

<li>
  <p>
    <AccountCell {node} />
    <span class="num other avg-col">
      {#each Object.entries(avg_balance) as [currency, number] (currency)}
        <span title={$currency_name(currency)}>
          {format_amount(currency, number)}
        </span>
        <br />
      {/each}
    </span>
    {#each nodes as n, index (index)}
      {@const account_budget = account_budgets?.[index]}
      {@const has_balance =
        !is_empty(n.balance) ||
        (account_budget != null && !is_empty(account_budget.budget))}
      {@const show_balance = !is_toggled && has_balance}
      {@const shown_balance = show_balance ? n.balance : n.balance_children}
      {@const shown_budget = show_balance
        ? account_budget?.budget
        : account_budget?.budget_children}
      <span class="num other" class:dimmed={!is_toggled && !has_balance}>
        {#each Object.entries(shown_balance) as [currency, number] (currency)}
          {@const budget = shown_budget?.[currency]}
          <span title={$currency_name(currency)}>
            {format_amount(currency, number)}
          </span>
          {#if budget}
            <Diff diff={budget - number} num={budget} {currency} />
          {/if}
          <br />
        {/each}
        {#if shown_budget}
          {#each Object.entries(shown_budget).filter(([c]) => !(shown_balance[c] ?? 0)) as [currency, budget] (currency)}
            <span title={$currency_name(currency)}>
              {format_amount(currency, 0)}
            </span>
            <Diff diff={budget} num={budget} {currency} />
            <br />
          {/each}
        {/if}
      </span>
    {/each}
  </p>
  {#if !is_toggled && children.some((n) => !$not_shown.has(n.account))}
    <ol>
      {#each children as child, index (child.account)}
        {#if !$not_shown.has(child.account)}
          <IntervalTreeTableNode
            nodes={nodes.map((n) => n.children[index]) as unknown as Nodes}
            {budgets}
          />
        {/if}
      {/each}
    </ol>
  {/if}
</li>
