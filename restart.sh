#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=========================================="
echo "  RENTIGO - Restart"
echo "=========================================="

echo ""
echo "[1/3] Ensuring services are running..."
if ! docker ps | grep -q rentigo-postgres; then
    echo "  Starting PostgreSQL and RabbitMQ..."
    docker compose up -d

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
else
    echo "  Services already running."
fi

echo ""
echo "[2/3] Building application..."
mvn package -DskipTests -q

echo ""
echo "[3/3] Starting application..."
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
