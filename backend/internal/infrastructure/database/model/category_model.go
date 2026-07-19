package model

import "time"

type CategoryModel struct {
	ID        string     `gorm:"column:id;primaryKey"`
	Name      string     `gorm:"column:name"`
	IsDeleted bool       `gorm:"column:is_deleted"`
	DeletedAt *time.Time `gorm:"column:deleted_at"`
}

func (CategoryModel) TableName() string {
	return "categories"
}
