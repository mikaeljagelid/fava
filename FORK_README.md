# Fork Notes

This fork adds a small set of UI and reporting tweaks on top of upstream Fava.

## Added Features

- Hide operating currency in interval tree tables

  - For operating currencies, the interval tables now render the numeric value
    without the currency suffix (e.g. `1 234.56` instead of `1 234.56 SEK`).
  - Other currencies still show their currency suffix (e.g. `1 234.56 USD`).

- Tree table column width settings

  - Two new Fava options control column widths in `em` units:
    - `tree-table-num-width-em`: width for operating-currency numeric columns.
    - `tree-table-other-width-em`: width for “Other” and interval columns.
  - These options are exposed to the frontend as CSS variables:
    - `--tree-table-num-width`
    - `--tree-table-other-width`
  - Defaults are `6.5em` and `8.5em` respectively.

- Report-only currency-hiding macros

  - Added Jinja macros that hide the operating currency suffix without touching
    global formatters:
    - `render_amount_hide_operating`
    - `render_num_hide_operating`

## How to Use Column Width Options

Add `fava-option` custom entries in your Beancount file:

```beancount
2026-02-03 custom "fava-option" "tree-table-num-width-em" "5.0"
2026-02-03 custom "fava-option" "tree-table-other-width-em" "6.5"
```

These values are floats in `em` units. Reload Fava after changing the file.

## Demo Ledger

A minimal demo ledger lives at:

- `beans/minimal.sek.beancount`

It includes example transactions in SEK and sample Fava options.
