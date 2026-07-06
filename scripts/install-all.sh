#!/usr/bin/env bash
# Install npm dependencies for TrippyJiffy + Leads Extractor
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Installing TrippyJiffy backend..."
(cd "Backend (5)/Backend" && npm install)

echo "==> Installing TrippyJiffy frontend..."
(cd "Frontend (8)/Frontend" && npm install)

echo "==> Installing Leads Extractor..."
(cd "Leads-Extractor" && npm install)

echo "==> All dependencies installed."
