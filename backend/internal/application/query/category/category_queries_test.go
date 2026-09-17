package category_test

import (
	"context"
	"errors"
	"testing"

	query "github.com/mlwy4id/stockify/internal/application/query/category"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/test/fakes"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func Test_GetAllCategoriesQuery_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()
	boom := errors.New("boom")

	t.Run("maps every category of the user", func(t *testing.T) {
		drinks := fakes.MustCategory(t, userID, "Minuman")
		snacks := fakes.MustCategory(t, userID, "Makanan")

		repo := new(fakes.MockCategoryRepository)
		repo.On("FindAll", mock.Anything, userID).Return([]*entity.Category{&drinks, &snacks}, nil)

		categories, err := query.NewGetAllCategoryQueryHandler(repo).Handle(context.Background(), userID)

		require.NoError(t, err)
		require.Len(t, categories, 2)
		assert.Equal(t, drinks.Id().Value(), categories[0].ID)
		assert.Equal(t, "Minuman", categories[0].Name)
		assert.Equal(t, snacks.Id().Value(), categories[1].ID)
		repo.AssertExpectations(t)
	})

	t.Run("returns the repository error", func(t *testing.T) {
		repo := new(fakes.MockCategoryRepository)
		repo.On("FindAll", mock.Anything, userID).Return(nil, boom)

		categories, err := query.NewGetAllCategoryQueryHandler(repo).Handle(context.Background(), userID)

		require.ErrorIs(t, err, boom)
		assert.Nil(t, categories)
	})
}

func Test_GetCategoryByIDQuery_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()
	categoryID := vo.NewCategoryId()
	boom := errors.New("boom")

	t.Run("maps the category", func(t *testing.T) {
		drinks := fakes.MustCategory(t, userID, "Minuman")

		repo := new(fakes.MockCategoryRepository)
		repo.On("FindByID", mock.Anything, userID, categoryID).Return(&drinks, nil)

		category, err := query.NewGetCategoryByIDQueryHandler(repo).Handle(context.Background(), query.GetCategoryByIDQuery{
			UserId:     userID,
			CategoryID: categoryID,
		})

		require.NoError(t, err)
		require.NotNil(t, category)
		assert.Equal(t, drinks.Id().Value(), category.ID)
		assert.Equal(t, "Minuman", category.Name)
		repo.AssertExpectations(t)
	})

	t.Run("returns the repository error", func(t *testing.T) {
		repo := new(fakes.MockCategoryRepository)
		repo.On("FindByID", mock.Anything, userID, categoryID).Return(nil, boom)

		category, err := query.NewGetCategoryByIDQueryHandler(repo).Handle(context.Background(), query.GetCategoryByIDQuery{
			UserId:     userID,
			CategoryID: categoryID,
		})

		require.ErrorIs(t, err, boom)
		assert.Nil(t, category)
	})
}
