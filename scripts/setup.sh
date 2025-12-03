#!/usr/bin/env bash
set -euo pipefail

echo "=== setup.sh: Preparing dev environment ==="

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# 1) Backend python virtualenv (we detect if backend/venv exists; prefer creating venv outside repo if you want)
BACKEND_VENV_DIR="$ROOT/backend/venv"

if [ ! -d "$BACKEND_VENV_DIR" ]; then
  echo "Creating Python virtualenv at backend/venv ..."
  python3 -m venv "$BACKEND_VENV_DIR"
else
  echo "Using existing virtualenv at backend/venv"
fi

# Activate venv for package installation
# shellcheck disable=SC1090
source "$BACKEND_VENV_DIR/bin/activate"

echo "Upgrading pip..."
pip install --upgrade pip

echo "Installing backend requirements..."
pip install -r backend/requirements.txt

# 2) Frontend node modules
echo "Installing frontend node modules..."
if [ -d "$ROOT/frontend" ]; then
  cd "$ROOT/frontend"
  if [ -f package-lock.json ] || [ -f package.json ]; then
    npm install
  else
    echo "No package.json found in frontend — skipping npm install"
  fi
  cd "$ROOT"
fi

echo "Setup complete. Next steps:"
echo "  1) Edit backend/.env (copy backend/.env.example -> backend/.env and fill values)."
echo "  2) Create the DB (MySQL) and run migrations:"
echo "     cd backend && source venv/bin/activate && export FLASK_APP=run.py && flask db upgrade"
echo
echo "Note: Consider moving virtualenv outside repo root to avoid committing env by mistake."
