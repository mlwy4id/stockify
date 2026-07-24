package repository

import (
	"context"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	domRepo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/infrastructure/database/model"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) domRepo.UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Save(ctx context.Context, user *entity.User) error {
	m := &model.UserModel{
		ID:           user.Id().Value(),
		Email:        user.Email().Value(),
		Name:         user.Name(),
		PasswordHash: user.PasswordHash(),
		CreatedAt:    user.CreatedAt(),
		UpdatedAt:    user.UpdatedAt(),
	}

	return r.db.WithContext(ctx).Save(m).Error
}

func (r *UserRepository) FindByID(ctx context.Context, id vo.UserId) (*entity.User, error) {
	var m model.UserModel
	err := r.db.WithContext(ctx).Where("id = ?", id.Value()).First(&m).Error
	if err != nil {
		return nil, err
	}

	return r.toEntityFromModel(&m)
}

func (r *UserRepository) FindByEmail(ctx context.Context, email string) (*entity.User, error) {
	var m model.UserModel
	err := r.db.WithContext(ctx).Where("email = ?", email).First(&m).Error
	if err != nil {
		return nil, err
	}

	return r.toEntityFromModel(&m)
}

func (r *UserRepository) toEntityFromModel(m *model.UserModel) (*entity.User, error) {
	userId, err := vo.ParseUserId(m.ID)
	if err != nil {
		return nil, err
	}

	email := vo.ReconstructEmail(m.Email)

	user := entity.ReconstructUser(userId, email, m.Name, m.PasswordHash, m.CreatedAt, m.UpdatedAt)
	return &user, nil
}
