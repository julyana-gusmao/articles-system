#!/bin/sh
set -e

echo "Waiting for DB..."
sleep 3

echo "Running migrations..."
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d src/datasource.ts

echo "Running seed..."
npx ts-node -r tsconfig-paths/register src/seeds/seed.ts

echo "Starting app..."
exec "$@"
