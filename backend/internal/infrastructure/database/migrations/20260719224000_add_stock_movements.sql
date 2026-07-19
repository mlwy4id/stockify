-- +goose Up
CREATE TABLE stock_movements (
    id VARCHAR(36) PRIMARY KEY,
    product_id VARCHAR(36) NOT NULL,
    action VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    source VARCHAR(255),
    reason VARCHAR(255),
    date TIMESTAMP NOT NULL,
    CONSTRAINT fk_stock_movements_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
);

-- +goose Down
DROP TABLE stock_movements;
