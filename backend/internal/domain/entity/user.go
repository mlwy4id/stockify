package entity

import (
	"errors"
	"strings"
	"time"

	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
)

type User struct {
	id           vo.UserId
	email        vo.Email
	name         string
	passwordHash string
	createdAt    time.Time
	updatedAt    time.Time
}

func NewUser(email vo.Email, name string, passwordHash string) (User, error) {
	trimmedName := strings.TrimSpace(name)

	if trimmedName == "" {
		return User{}, errors.New("name must not be empty")
	}

	if passwordHash == "" {
		return User{}, errors.New("password must not be empty")
	}

	now := time.Now()

	return User{
		id:           vo.NewUserId(),
		email:        email,
		name:         trimmedName,
		passwordHash: passwordHash,
		createdAt:    now,
		updatedAt:    now,
	}, nil
}

func (u User) Id() vo.UserId {
	return u.id
}

func (u User) Email() vo.Email {
	return u.email
}

func (u User) Name() string {
	return u.name
}

func (u User) PasswordHash() string {
	return u.passwordHash
}

func (u User) CreatedAt() time.Time {
	return u.createdAt
}

func (u User) UpdatedAt() time.Time {
	return u.updatedAt
}

func ReconstructUser(id vo.UserId, email vo.Email, name string, passwordHash string, createdAt time.Time, updatedAt time.Time) User {
	return User{
		id:           id,
		email:        email,
		name:         name,
		passwordHash: passwordHash,
		createdAt:    createdAt,
		updatedAt:    updatedAt,
	}
}
