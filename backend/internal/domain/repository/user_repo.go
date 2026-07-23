package repository

import (
	"context"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type UserRepository interface {
	Save(ctx context.Context, user *entity.User) error
	FindByID(ctx context.Context, id vo.UserId) (*entity.User, error)
	FindByEmail(ctx context.Context, email string) (*entity.User, error)
}
