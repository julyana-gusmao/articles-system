#!/bin/bash
set -e

echo "Wait DB..."
sleep 3

echo "Run migrations..."
node node_modules/typeorm/cli.js migration:run -d dist/typeorm.config.js

echo "Run seed..."
node dist/seeds/seed.js

echo "Start app..."
node dist/main.js
