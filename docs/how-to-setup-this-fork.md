# How to set up this fork (macOS Apple Silicon)

This fork follows the upstream development workflow, but the commands below are
specific to macOS on Apple Silicon.

## Prerequisites

Install the tooling with Homebrew:

```bash
brew install python node uv bison
```

Make sure Homebrew is on your PATH (Apple Silicon default):

```bash
eval "$(/opt/homebrew/bin/brew shellenv)"
```

## Setup

```bash
# from your clone of this fork
make dev
```

`make dev` will create a local `.venv`, sync Python dependencies with `uv`, and
install the git hooks.

## Frontend workflow (optional)

```bash
cd frontend
npm run dev
```

## Common fixes

- If a build complains about an old `bison`, ensure `/opt/homebrew/bin` is ahead
  of `/usr/bin` in your PATH so the Homebrew version is used.
- If `uv` is missing, re-run `brew install uv` and open a new shell.
