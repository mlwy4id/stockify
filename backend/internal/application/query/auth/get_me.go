package auth

import (
	"context"

	"github.com/mlwy4id/stockify/internal/application/dto"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type GetMeQuery struct {
	UserID vo.UserId
}

type GetMeQueryHandler struct {
	userRepo repo.UserRepository
}

func NewGetMeQueryHandler(userRepo repo.UserRepository) *GetMeQueryHandler {
	return &GetMeQueryHandler{userRepo: userRepo}
}

func (h *GetMeQueryHandler) Handle(ctx context.Context, query GetMeQuery) (*dto.AuthUserDTO, error) {
	user, err := h.userRepo.FindByID(ctx, query.UserID)
	if err != nil {
		return nil, err
	}

	return &dto.AuthUserDTO{
		ID:    user.Id().Value(),
		Email: user.Email().Value(),
		Name:  user.Name(),
	}, nil
}
