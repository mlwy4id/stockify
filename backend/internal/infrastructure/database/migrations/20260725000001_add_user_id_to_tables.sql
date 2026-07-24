-- +goose Up
ALTER TABLE categories ADD COLUMN user_id VARCHAR(36) REFERENCES users(id);
ALTER TABLE products ADD COLUMN user_id VARCHAR(36) REFERENCES users(id);
ALTER TABLE stock_movements ADD COLUMN user_id VARCHAR(36) REFERENCES users(id);

-- +goose Down
ALTER TABLE categories DROP COLUMN IF EXISTS user_id;
ALTER TABLE products DROP COLUMN IF EXISTS user_id;
ALTER TABLE stock_movements DROP COLUMN IF EXISTS user_id;
