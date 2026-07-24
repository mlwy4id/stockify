package model

import "time"

type ProductModel struct {
	ID             string               `gorm:"column:id;primaryKey"`
	UserID         string               `gorm:"column:user_id"`
	Name           string               `gorm:"column:name"`
	Quantity       int                  `gorm:"column:quantity"`
	StockThreshold int                  `gorm:"column:stock_threshold"`
	CategoryID     *string              `gorm:"column:category_id"`
	Category       CategoryModel        `gorm:"foreignKey:CategoryID"`
	StockMovements []StockMovementModel `gorm:"foreignKey:ProductID"`
	ArchivedAt     *time.Time           `gorm:"column:archived_at"`
}

func (ProductModel) TableName() string {
	return "products"
}
