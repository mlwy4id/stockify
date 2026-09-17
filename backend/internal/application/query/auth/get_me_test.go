package auth_test

import (
	"context"
	"errors"
	"testing"

	query "github.com/mlwy4id/stockify/internal/application/query/auth"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/test/fakes"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func Test_GetMeQuery_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()
	boom := errors.New("boom")

	t.Run("returns the profile of the authenticated user", func(t *testing.T) {
		user := fakes.MustUser(t, "budi@example.com", "Budi", "hash")

		repo := new(fakes.MockUserRepository)
		repo.On("FindByID", mock.Anything, userID).Return(&user, nil)

		profile, err := query.NewGetMeQueryHandler(repo).Handle(context.Background(), query.GetMeQuery{UserID: userID})

		require.NoError(t, err)
		require.NotNil(t, profile)
		assert.Equal(t, user.Id().Value(), profile.ID)
		assert.Equal(t, "budi@example.com", profile.Email)
		assert.Equal(t, "Budi", profile.Name)
		repo.AssertExpectations(t)
	})

	t.Run("returns the repository error", func(t *testing.T) {
		repo := new(fakes.MockUserRepository)
		repo.On("FindByID", mock.Anything, userID).Return(nil, boom)

		profile, err := query.NewGetMeQueryHandler(repo).Handle(context.Background(), query.GetMeQuery{UserID: userID})

		require.ErrorIs(t, err, boom)
		assert.Nil(t, profile)
	})
}
