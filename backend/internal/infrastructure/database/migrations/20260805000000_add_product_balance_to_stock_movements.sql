-- +goose Up
ALTER TABLE stock_movements ADD COLUMN product_balance INT NOT NULL DEFAULT 0;

-- +goose Down
ALTER TABLE stock_movements DROP COLUMN IF EXISTS product_balance;
