# Fava – Claude Code Guide

This is a personal fork of [Fava](https://github.com/beancount/fava), a web UI
for Beancount double-entry bookkeeping. See `FORK_README.md` for what this fork
adds on top of upstream.

## Architecture

- **Backend**: Python/Flask (`src/fava/`)
- **Frontend**: TypeScript + Svelte 5, built with esbuild (`frontend/src/`) →
  outputs to `src/fava/static/`
- **Templates**: Jinja2 (`src/fava/templates/`)
- **Tests**: pytest (Python) + Node (JS/TS)
- **Package manager**: `uv` (Python), `npm` (JS)

## Setup

```bash
make dev          # Create .venv and install Python deps
cd frontend && npm install   # Install JS deps (or let make handle it)
```

The `.venv` is activated automatically if you use direnv (`.envrc` is present).

## Build

```bash
make              # Build frontend (src/fava/static/app.js)
make dist         # Build wheel + sdist via uv build
```

The build backend (`_build_backend.py`) auto-compiles the frontend and
translations when building the Python package.

## Run (development)

```bash
# Default: run fava against the main ledger
uv run fava ~/bc/main.beancount

# Or against the demo ledger
uv run fava beans/minimal.sek.beancount

# Or against the test data
make run-example

# Frontend watch mode (in a separate terminal)
cd frontend && npm run dev
```

## Test

```bash
make test              # All tests (JS + Python)
make test-js           # JS tests only
make test-py           # Python tests with coverage (100% required)
make test-py-old-deps  # Python tests with lowest pinned dependencies
```

Python tests require 100% coverage. If you add new code, add tests.

## Lint

```bash
make lint         # pre-commit + TypeScript + svelte-check
make mypy         # Python type checking (mypy)
make ty           # Python type checking (ty - alternative checker)
```

## Update snapshots

```bash
make update-snapshots
```

## Deploying

This fork is used locally; there is no custom deploy target beyond the upstream
PyPI publish workflow (`.github/workflows/publish.yml`). To build a
distributable:

```bash
make dist         # Creates dist/*.whl and dist/*.tar.gz
```

To install the local build:

```bash
pip install dist/fava-*.whl
```

## Key paths

| Path                          | Purpose                                         |
| ----------------------------- | ----------------------------------------------- |
| `src/fava/`                   | Python package                                  |
| `src/fava/application.py`     | Flask app initialization                        |
| `src/fava/json_api.py`        | Main JSON API endpoints                         |
| `src/fava/core/`              | Core business logic (accounts, charts, budgets) |
| `src/fava/beans/`             | Beancount utilities and type wrappers           |
| `src/fava/templates/`         | Jinja2 templates                                |
| `src/fava/static/`            | Compiled frontend output (do not edit directly) |
| `src/fava/translations/`      | i18n .po/.mo files (16 languages)               |
| `frontend/src/`               | TypeScript/Svelte source                        |
| `frontend/src/stores/`        | Svelte stores (app-wide state)                  |
| `frontend/src/reports/`       | Per-report Svelte components                    |
| `frontend/src/api/`           | Frontend API client layer                       |
| `frontend/src/charts/`        | D3-based chart components                       |
| `frontend/src/codemirror/`    | CodeMirror 6 editor integration + BQL language  |
| `frontend/css/`               | CSS source                                      |
| `tests/`                      | Python test suite (41 test files)               |
| `frontend/test/`              | JS/TS test suite (19 test files)                |
| `beans/minimal.sek.beancount` | Demo ledger (SEK, fork-specific options)        |
| `FORK_README.md`              | Documents all fork-specific changes             |
| `_build_backend.py`           | Custom build backend (compiles frontend + i18n) |

## Code conventions

### Python

- **Formatter**: `ruff format` (line length 79)
- **Linter**: `ruff check` with strict rules (see `pyproject.toml`)
- **Type checking**: `mypy` strict + `ty`; 100% annotation coverage expected
- **Imports**: one import per line, grouped by type
- **Coverage**: 100% required — every new code path needs a test
- **Docstrings**: Google-style where used

### TypeScript / Svelte

- **Framework**: Svelte 5 with runes (`$state`, `$derived`, `$effect`)
- **Formatter**: `prettier` with `prettier-plugin-svelte`
- **Linter**: `eslint` + `stylelint` + `svelte-check`
- **Target**: ES2024, strict TypeScript (`@tsconfig/strictest`)
- **State management**: Svelte stores in `frontend/src/stores/`

### General

- Pre-commit hooks enforced via `.pre-commit-config.yaml`
- EditorConfig (`.editorconfig`) for whitespace consistency
- Never edit `src/fava/static/` directly — it is generated output

## Python package structure

```
src/fava/
├── application.py        # Flask app factory
├── cli.py                # click CLI entry point
├── json_api.py           # REST/JSON API (main API surface)
├── internal_api.py       # Internal API helpers
├── serialisation.py      # Data serialization to/from JSON
├── template_filters.py   # Jinja2 template filters
├── beans/                # Thin wrappers around Beancount types
├── core/                 # Business logic modules
│   ├── accounts.py       # Account tree
│   ├── budgets.py        # Budget calculations
│   ├── charts.py         # Chart data generation
│   ├── fava_options.py   # Fava-specific options (incl. fork additions)
│   ├── filters.py        # Entry filtering
│   ├── query.py          # BQL query execution
│   └── ...
├── ext/                  # Bundled extensions (portfolio_list, etc.)
├── plugins/              # Beancount plugins
├── templates/            # Jinja2 HTML templates
├── translations/         # i18n (Babel)
└── util/                 # Misc utilities (date, excel, ranking)
```

## Frontend structure

```
frontend/src/
├── app.ts                # Entry point
├── router.ts             # Client-side routing
├── api/                  # API client (calls json_api.py)
├── charts/               # D3 chart components
├── codemirror/           # BQL editor (CodeMirror 6 + Tree Sitter)
├── editor/               # Source file editor components
├── entry-forms/          # Forms for creating Beancount entries
├── modals/               # Modal dialogs (AddEntry, Export, Upload, etc.)
├── reports/              # One subdirectory per Fava report
│   ├── journal/          # Journal report
│   ├── tree_reports/     # Balance sheet, income statement, etc.
│   ├── query/            # BQL query interface
│   └── ...
├── stores/               # Svelte stores (global app state)
├── sort/                 # Table sorting utilities
└── tree-table/           # Expandable tree table components
```

## Key dependencies

### Backend

| Package      | Version | Purpose                      |
| ------------ | ------- | ---------------------------- |
| Flask        | 2.2–4   | Web framework                |
| Beancount    | 2–4     | Bookkeeping engine           |
| beanquery    | 0.1–0.3 | BQL query language           |
| beangulp     | 0.1+    | Importer framework           |
| Jinja2       | 3–4     | Templates                    |
| Babel        | 3–5     | i18n                         |
| watchfiles   | 0.20+   | File watcher                 |

### Frontend

| Package        | Purpose                         |
| -------------- | ------------------------------- |
| Svelte 5       | Component framework             |
| TypeScript 5.6 | Language                        |
| esbuild 0.27+  | Bundler                         |
| D3.js          | Charts and visualizations       |
| CodeMirror 6   | Source/BQL editor               |
| Web Tree Sitter| Syntax highlighting             |

## CI/CD

Workflows live in `.github/workflows/`:

- **test.yml**: Matrix tests across Linux/macOS/Windows × Python 3.10–3.14
  and Node LTS + current. Runs Python + JS tests, mypy, ty, eslint,
  stylelint, svelte-check, and Deno linting.
- **publish.yml**: PyPI publication on tagged releases.
- **docs-pages.yml**: Sphinx docs deployed to GitHub Pages.

## Fork-specific features

See `FORK_README.md` for full details. In brief:

- **Currency hiding**: interval tree tables omit the operating currency suffix
- **Column width options**: `tree-table-num-width-em` / `tree-table-other-width-em`
  Fava options exposed as CSS variables
- **Account description**: `description` metadata on `open` directives shown
  in the account page header
- **Click-to-toggle flag**: clicking `*`/`!` in the journal table toggles
  transaction status and saves to disk
- **Chart follows tree**: stacked bar chart series track expanded/collapsed
  tree nodes in real time

Fork-specific Fava options are implemented in `src/fava/core/fava_options.py`
and `frontend/src/stores/fava_options.ts`.
