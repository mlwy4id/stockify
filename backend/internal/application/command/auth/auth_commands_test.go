package auth_test

import (
	"context"
	"errors"
	"strings"
	"testing"

	command "github.com/mlwy4id/stockify/internal/application/command/auth"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	"github.com/mlwy4id/stockify/internal/test/mocks"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
	"golang.org/x/crypto/bcrypt"
)

func Test_SignUpCommand_AllCases_CorrectResults(t *testing.T) {
	boom := errors.New("boom")

	t.Run("hashes the password and returns the new user id", func(t *testing.T) {
		repo := new(mocks.MockUserRepository)
		repo.On("FindByEmail", mock.Anything, "budi@example.com").Return(nil, boom)
		repo.On("Save", mock.Anything, mock.MatchedBy(func(u *entity.User) bool {
			return u.Name() == "Budi" &&
				u.Email().Value() == "budi@example.com" &&
				bcrypt.CompareHashAndPassword([]byte(u.PasswordHash()), []byte("password123")) == nil
		})).Return(nil)

		id, err := command.NewSignUpCommandHandler(repo).Handle(context.Background(), command.SignUpCommand{
			Email:    "  budi@example.com  ",
			Name:     "Budi",
			Password: "password123",
		})

		require.NoError(t, err)
		assert.NotEmpty(t, id)
		repo.AssertExpectations(t)
	})

	t.Run("rejects an invalid email before touching the repository", func(t *testing.T) {
		repo := new(mocks.MockUserRepository)

		_, err := command.NewSignUpCommandHandler(repo).Handle(context.Background(), command.SignUpCommand{
			Email:    "not-an-email",
			Name:     "Budi",
			Password: "password123",
		})

		require.Error(t, err)
		repo.AssertNotCalled(t, "FindByEmail", mock.Anything, mock.Anything)
		repo.AssertNotCalled(t, "Save", mock.Anything, mock.Anything)
	})

	t.Run("rejects an email that is already registered", func(t *testing.T) {
		existing := mocks.MustUser(t, "budi@example.com", "Budi", "hash")

		repo := new(mocks.MockUserRepository)
		repo.On("FindByEmail", mock.Anything, "budi@example.com").Return(&existing, nil)

		_, err := command.NewSignUpCommandHandler(repo).Handle(context.Background(), command.SignUpCommand{
			Email:    "budi@example.com",
			Name:     "Budi",
			Password: "password123",
		})

		require.ErrorIs(t, err, command.ErrEmailAlreadyExists)
		repo.AssertNotCalled(t, "Save", mock.Anything, mock.Anything)
	})

	t.Run("rejects a blank name without saving", func(t *testing.T) {
		repo := new(mocks.MockUserRepository)
		repo.On("FindByEmail", mock.Anything, "budi@example.com").Return(nil, boom)

		_, err := command.NewSignUpCommandHandler(repo).Handle(context.Background(), command.SignUpCommand{
			Email:    "budi@example.com",
			Name:     "   ",
			Password: "password123",
		})

		require.Error(t, err)
		repo.AssertNotCalled(t, "Save", mock.Anything, mock.Anything)
	})

	t.Run("propagates the save error", func(t *testing.T) {
		repo := new(mocks.MockUserRepository)
		repo.On("FindByEmail", mock.Anything, "budi@example.com").Return(nil, boom)
		repo.On("Save", mock.Anything, mock.Anything).Return(boom)

		_, err := command.NewSignUpCommandHandler(repo).Handle(context.Background(), command.SignUpCommand{
			Email:    "budi@example.com",
			Name:     "Budi",
			Password: "password123",
		})

		require.ErrorIs(t, err, boom)
		repo.AssertExpectations(t)
	})

	t.Run("rejects a password longer than bcrypt can hash", func(t *testing.T) {
		repo := new(mocks.MockUserRepository)
		repo.On("FindByEmail", mock.Anything, "budi@example.com").Return(nil, boom)

		_, err := command.NewSignUpCommandHandler(repo).Handle(context.Background(), command.SignUpCommand{
			Email:    "budi@example.com",
			Name:     "Budi",
			Password: strings.Repeat("a", 73),
		})

		require.Error(t, err)
		repo.AssertNotCalled(t, "Save", mock.Anything, mock.Anything)
	})
}

func Test_SignInCommand_AllCases_CorrectResults(t *testing.T) {
	boom := errors.New("boom")

	hashedUser := func(t *testing.T, password string) *entity.User {
		t.Helper()
		hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.MinCost)
		require.NoError(t, err)
		u := mocks.MustUser(t, "budi@example.com", "Budi", string(hash))
		return &u
	}

	t.Run("returns the profile for valid credentials", func(t *testing.T) {
		repo := new(mocks.MockUserRepository)
		repo.On("FindByEmail", mock.Anything, "budi@example.com").Return(hashedUser(t, "password123"), nil)

		user, err := command.NewSignInCommandHandler(repo).Handle(context.Background(), command.SignInCommand{
			Email:    "budi@example.com",
			Password: "password123",
		})

		require.NoError(t, err)
		require.NotNil(t, user)
		assert.Equal(t, "budi@example.com", user.Email)
		assert.Equal(t, "Budi", user.Name)
		assert.NotEmpty(t, user.ID)
		repo.AssertExpectations(t)
	})

	t.Run("rejects an unknown email", func(t *testing.T) {
		repo := new(mocks.MockUserRepository)
		repo.On("FindByEmail", mock.Anything, "budi@example.com").Return(nil, boom)

		_, err := command.NewSignInCommandHandler(repo).Handle(context.Background(), command.SignInCommand{
			Email:    "budi@example.com",
			Password: "password123",
		})

		require.ErrorIs(t, err, command.ErrInvalidCredentials)
	})

	t.Run("rejects a wrong password", func(t *testing.T) {
		repo := new(mocks.MockUserRepository)
		repo.On("FindByEmail", mock.Anything, "budi@example.com").Return(hashedUser(t, "password123"), nil)

		_, err := command.NewSignInCommandHandler(repo).Handle(context.Background(), command.SignInCommand{
			Email:    "budi@example.com",
			Password: "wrong-password",
		})

		require.ErrorIs(t, err, command.ErrInvalidCredentials)
	})

	t.Run("does not leak whether the email exists", func(t *testing.T) {
		unknownRepo := new(mocks.MockUserRepository)
		unknownRepo.On("FindByEmail", mock.Anything, "budi@example.com").Return(nil, boom)

		_, unknownErr := command.NewSignInCommandHandler(unknownRepo).Handle(context.Background(), command.SignInCommand{
			Email:    "budi@example.com",
			Password: "password123",
		})

		wrongPasswordRepo := new(mocks.MockUserRepository)
		wrongPasswordRepo.On("FindByEmail", mock.Anything, "budi@example.com").Return(hashedUser(t, "password123"), nil)

		_, wrongPasswordErr := command.NewSignInCommandHandler(wrongPasswordRepo).Handle(context.Background(), command.SignInCommand{
			Email:    "budi@example.com",
			Password: "wrong-password",
		})

		assert.Equal(t, unknownErr, wrongPasswordErr)
		require.ErrorIs(t, wrongPasswordErr, command.ErrInvalidCredentials)
	})
}
