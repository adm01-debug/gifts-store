#!/bin/bash
set -e

echo "🌱 Seeding database..."

psql $DATABASE_URL << SQL
INSERT INTO products (name, price, stock) VALUES
  ('Caneta', 2.50, 1000),
  ('Squeeze', 15.00, 500),
  ('Caderno', 12.00, 300);
SQL

echo "✅ Seed concluído"
