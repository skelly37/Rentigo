#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=========================================="
echo "  RENTIGO - Fresh Start"
echo "=========================================="

echo ""
echo "[1/5] Stopping existing containers..."
docker compose down -v 2>/dev/null || true

echo ""
echo "[2/5] Starting PostgreSQL and RabbitMQ..."
docker compose up -d

echo ""
echo "[3/5] Waiting for services to be ready..."
echo -n "  Waiting for PostgreSQL"
until docker exec rentigo-postgres pg_isready -U postgres > /dev/null 2>&1; do
    echo -n "."
    sleep 1
done
echo " OK"

echo -n "  Waiting for RabbitMQ"
until docker exec rentigo-rabbitmq rabbitmq-diagnostics -q ping > /dev/null 2>&1; do
    echo -n "."
    sleep 1
done
echo " OK"

echo ""
echo "[4/5] Building application (backend + React frontend)..."
echo "  This will take a minute on first run..."
mvn clean install -DskipTests

echo ""
echo "[5/5] Starting application..."
echo ""
echo "=========================================="
echo "  Application starting on port 8080"
echo "=========================================="
echo ""
echo "  URLs:"
echo "    - Frontend:   http://localhost:8080"
echo "    - Swagger UI: http://localhost:8080/swagger-ui.html"
echo "    - RabbitMQ:   http://localhost:15672 (guest/guest)"
echo ""
echo "  Test users:"
echo "    - admin@rentigo.pl / admin123 (ADMIN)"
echo "    - host@rentigo.pl  / host123  (HOST)"
echo "    - user@rentigo.pl  / user123  (USER)"
echo ""
echo "  Press Ctrl+C to stop"
echo "=========================================="
echo ""

java -jar target/rentigo-1.0-SNAPSHOT.jar
