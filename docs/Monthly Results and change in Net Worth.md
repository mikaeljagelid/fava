# Monthly Results and change in Net Worth

## Background

- Fava provides an income statement that in reality is two tables, one for
  income and one for expenses.
- There is no view that shows income, expenses and result per month.
- Fava provides a balance sheet but there is no view that shows the change in
  net worth, assets and liabilities from period to period

## Idea

- Provide a new tree-view with columns according to the selected period settings
  (Yearly, Monthly,...).

- The tree view is actually several tree views:

  - Income
  - Expenses
  - A new line showing the Result (=Income - Expenses)
  - Net Worth at start of period
  - Change in Assets
  - Change in Liabilites

Net Worth at end of period

### Total Income

- The tree view for all Income:-accounts

### Total Expenses

- The tree view for all Expenses-accounts

### Results

- showing the Result for the period defined as Income - Expenses

### Net Worth

#### Net Worth at the beginning of the period

```
+ Total Assets (at the beginning of the period)
- Total Liabiliets (at the beginning of the period)
------------------
= Net Worth (at the beginning of the period)
```

- Total Assets is an expandeble tree-list, allowing the user to view all levels
  of Asset accounts.
- Total Liabilities is an expandeble tree-list, allowing the user to view all
  levels of Liabilities accounts.

#### Change in Net Worth

```
+ Change in Assets for the period
- Change in Liabilities for the period
------------------
= Change in Net Worth for the period
```

- Change in Assets is an expandeble tree-list, allowing the user to view all
  levels of Asset accounts.
- Change in Liabilities is an expandeble tree-list, allowing the user to view
  all levels of Liabilities accounts.

#### Net Worth at the end of the period

```
+ Total Assets (at the end of the period)
- Total Liabiliets (at the end of the period)
------------------
= Net Worth (at the end of the period)
```

- Total Assets is an expandable tree-list, allowing the user to view all levels
  of Asset accounts.
- Total Liabilities is an expandable tree-list, allowing the user to view all
  levels of Liabilities accounts.
