# Fava – Claude Code Guide

This is a personal fork of [Fava](https://github.com/beancount/fava), a web UI
for Beancount double-entry bookkeeping. See `FORK_README.md` for what this fork
adds on top of upstream.

## Architecture

- **Backend**: Python/Flask (`src/fava/`)
- **Frontend**: TypeScript + Svelte, built with esbuild (`frontend/src/`) →
  outputs to `src/fava/static/`
- **Templates**: Jinja2 (`src/fava/templates/`)
- **Tests**: pytest (Python) + node (JS)
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
make test         # All tests (JS + Python)
make test-js      # JS tests only
make test-py      # Python tests with coverage (100% required)
```

Python tests require 100% coverage. If you add new code, add tests.

## Lint

```bash
make lint         # pre-commit + TypeScript + svelte-check
make mypy         # Python type checking (mypy)
make ty           # Python type checking (ty)
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
| `src/fava/templates/`         | Jinja2 templates                                |
| `src/fava/static/`            | Compiled frontend output (do not edit directly) |
| `frontend/src/`               | TypeScript/Svelte source                        |
| `frontend/css/`               | CSS source                                      |
| `beans/minimal.sek.beancount` | Demo ledger (SEK, fork-specific options)        |
| `FORK_README.md`              | Documents all fork-specific changes             |
