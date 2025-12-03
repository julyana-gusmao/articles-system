#!/bin/sh

echo "Waiting for DB..."
sleep 5

echo "Running migrations..."
node node_modules/typeorm/cli.js migration:run -d dist/typeorm.config.js

echo "Seeding..."
node dist/seeds/seed.js

echo "Starting app..."
exec node dist/main.js
