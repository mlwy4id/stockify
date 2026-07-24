package model

import "time"

type CategoryModel struct {
	ID        string     `gorm:"column:id;primaryKey"`
	UserID    string     `gorm:"column:user_id"`
	Name      string     `gorm:"column:name"`
	IsDeleted bool       `gorm:"column:is_deleted"`
	DeletedAt *time.Time `gorm:"column:deleted_at"`
}

func (CategoryModel) TableName() string {
	return "categories"
}
