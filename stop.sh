#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=========================================="
echo "  RENTIGO - Stop"
echo "=========================================="

echo ""
echo "Stopping Docker containers..."
docker compose down

echo ""
echo "All services stopped."
