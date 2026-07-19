-- +goose Up
CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 0,
    stock_threshold INT DEFAULT 0,
    category_id VARCHAR(36),
    archived_at TIMESTAMP NULL
);

-- +goose Down
DROP TABLE products;
