package model

import "time"

type StockMovementModel struct {
	ID        string    `gorm:"column:id;primaryKey"`
	ProductID string    `gorm:"column:product_id"`
	Action    string    `gorm:"column:action"`
	Quantity  int       `gorm:"column:quantity"`
	Source    *string   `gorm:"column:source"`
	Reason    *string   `gorm:"column:reason"`
	Date      time.Time `gorm:"column:date"`
	Product   ProductModel `gorm:"foreignKey:ProductID"`
}

func (StockMovementModel) TableName() string {
	return "stock_movements"
}
