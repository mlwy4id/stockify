package auth

import (
	"context"

	"github.com/mlwy4id/stockify/internal/application/dto"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	"golang.org/x/crypto/bcrypt"
)

type SignInCommand struct {
	Email    string
	Password string
}

type SignInCommandHandler struct {
	userRepo repo.UserRepository
}

func NewSignInCommandHandler(userRepo repo.UserRepository) *SignInCommandHandler {
	return &SignInCommandHandler{userRepo: userRepo}
}

func (h *SignInCommandHandler) Handle(ctx context.Context, command SignInCommand) (*dto.AuthUserDTO, error) {
	user, err := h.userRepo.FindByEmail(ctx, command.Email)
	if err != nil {
		return nil, ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash()), []byte(command.Password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	return &dto.AuthUserDTO{
		ID:    user.Id().Value(),
		Email: user.Email().Value(),
		Name:  user.Name(),
	}, nil
}
