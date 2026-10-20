#!/bin/bash
# Startar forken ur repots egen venv. Sökvägar till böckerna tolkas från där du står.
exec "$(dirname "$0")/.venv/bin/fava" "$@"
