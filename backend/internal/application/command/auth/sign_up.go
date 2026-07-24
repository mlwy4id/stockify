package auth

import (
	"context"

	"github.com/mlwy4id/stockify/internal/domain/entity"
	repo "github.com/mlwy4id/stockify/internal/domain/repository"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"golang.org/x/crypto/bcrypt"
)

type SignUpCommand struct {
	Email    string
	Name     string
	Password string
}

type SignUpCommandHandler struct {
	userRepo repo.UserRepository
}

func NewSignUpCommandHandler(userRepo repo.UserRepository) *SignUpCommandHandler {
	return &SignUpCommandHandler{userRepo: userRepo}
}

func (h *SignUpCommandHandler) Handle(ctx context.Context, command SignUpCommand) (string, error) {
	email, err := vo.NewEmail(command.Email)
	if err != nil {
		return "", err
	}

	existing, err := h.userRepo.FindByEmail(ctx, email.Value())
	if err == nil && existing != nil {
		return "", ErrEmailAlreadyExists
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(command.Password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	user, err := entity.NewUser(email, command.Name, string(hashedPassword))
	if err != nil {
		return "", err
	}

	if err := h.userRepo.Save(ctx, &user); err != nil {
		return "", err
	}

	return user.Id().Value(), nil
}
