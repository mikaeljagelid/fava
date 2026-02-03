# Stacked bars should follow visible tree nodes (Expenses report)

## Problem

Currently stacked bars show either totals or all accounts. They do not reflect
the report tree expansion state.

## Desired behavior

For each month, the stacked bar series must correspond exactly to the *currently
visible nodes in the report tree*.

Example:

- If the tree shows only first-level: Expenses:Housing, Expenses:Food => stack
  segments: Housing, Food (each sum includes alldescendants)
- If Housing is expanded and shows Expenses:Housing:Rent and
  Expenses:Housing:Electricity => stack segments: Rent, Electricity, Food
  (Housing must not double-count)

## Key rule (no double counting)

For each visible prefix p: exclusive(p) = inclusive(p) - sum(inclusive(c) for
visible children c of p)

Use exclusive(p) as the chart series values.

## Acceptance criteria

- Expanding/collapsing in the tree immediately changes the stacked bars.
- No double counting when a parent is expanded.
- Legend/stack order matches tree order.
- No backend changes unless absolutely necessary.

## Ask

1. Locate tree expansion state in the Expenses report UI.
1. Implement a derived series builder using the rule above.
1. Show diffs and explain touched files.
