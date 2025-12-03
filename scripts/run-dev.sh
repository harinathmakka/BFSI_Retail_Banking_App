#!/usr/bin/env bash
set -euo pipefail

echo "=== run-dev.sh: Start backend + frontend (dev) ==="

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# 1) Start backend in a separate terminal-like process (uses the venv inside backend/venv)
BACKEND_VENV="$ROOT/backend/venv"
if [ -d "$BACKEND_VENV" ]; then
  echo "Activating backend virtualenv..."
  # spawn backend in background
  ( source "$BACKEND_VENV/bin/activate" && \
    export FLASK_APP=run.py && \
    export FLASK_ENV=development && \
    cd "$ROOT/backend" && \
    echo "[backend] Starting Flask (run.py) on http://127.0.0.1:5000" && \
    python run.py ) & 
else
  echo "Warning: backend/venv not found. Please run scripts/setup.sh first or create a venv and install requirements."
fi

# 2) Start frontend (Vite)
if [ -d "$ROOT/frontend" ]; then
  echo "[frontend] Starting dev server (Vite) on default port..."
  ( cd "$ROOT/frontend" && npm run dev ) &
else
  echo "No frontend directory found. Skipping frontend startup."
fi

echo "Dev servers started in background. Use 'jobs' to see background tasks, or check terminals."
echo "To stop: use 'kill <pid>' or bring job to foreground and Ctrl+C."
