#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/frontend"

echo "=========================================="
echo "  Building React Frontend"
echo "=========================================="

if [ ! -d "node_modules" ]; then
    echo ""
    echo "Installing npm dependencies..."
    npm install
fi

echo ""
echo "Building frontend..."
npm run build

echo ""
echo "✓ Frontend built successfully!"
echo "  Output: src/main/resources/static/"
echo ""
