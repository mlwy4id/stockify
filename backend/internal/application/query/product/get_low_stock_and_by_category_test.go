package product_test

import (
	"context"
	"errors"
	"testing"

	query "github.com/mlwy4id/stockify/internal/application/query/product"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/mlwy4id/stockify/internal/test/mocks"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

func Test_GetLowStockProductsQuery_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()
	categoryID := vo.NewCategoryId()
	boom := errors.New("boom")

	t.Run("keeps only the products below their threshold", func(t *testing.T) {
		below := mocks.MustProductFull(t, userID, "Kopi", "https://img", 2, 5, &categoryID)
		atThreshold := mocks.MustProductFull(t, userID, "Teh", "", 5, 5, nil)
		above := mocks.MustProductFull(t, userID, "Gula", "", 9, 5, nil)

		repo := new(mocks.MockProductRepository)
		repo.On("FindAllActive", mock.Anything, userID).
			Return([]*entity.Product{&below, &atThreshold, &above}, nil)

		products, err := query.NewGetLowStockProductsHandler(repo).Handle(context.Background(), userID)

		require.NoError(t, err)
		require.Len(t, products, 1)
		assert.Equal(t, below.Id().Value(), products[0].ID)
		assert.Equal(t, 2, products[0].Quantity)
		require.NotNil(t, products[0].ImageUrl)
		require.NotNil(t, products[0].CategoryId)
		assert.Equal(t, categoryID.Value(), *products[0].CategoryId)
		assert.False(t, products[0].IsArchived)
		repo.AssertExpectations(t)
	})

	t.Run("only looks at active products", func(t *testing.T) {
		repo := new(mocks.MockProductRepository)
		repo.On("FindAllActive", mock.Anything, userID).Return([]*entity.Product{}, nil)

		products, err := query.NewGetLowStockProductsHandler(repo).Handle(context.Background(), userID)

		require.NoError(t, err)
		assert.Empty(t, products)
		repo.AssertNotCalled(t, "FindAll", mock.Anything, mock.Anything)
		repo.AssertExpectations(t)
	})

	t.Run("propagates the repository error", func(t *testing.T) {
		repo := new(mocks.MockProductRepository)
		repo.On("FindAllActive", mock.Anything, userID).Return(nil, boom)

		_, err := query.NewGetLowStockProductsHandler(repo).Handle(context.Background(), userID)

		require.ErrorIs(t, err, boom)
	})
}

func Test_GetProductsByCategoryQuery_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()
	categoryID := vo.NewCategoryId()
	boom := errors.New("boom")

	t.Run("maps the products of the category", func(t *testing.T) {
		coffee := mocks.MustProductFull(t, userID, "Kopi", "https://img", 10, 3, &categoryID)

		repo := new(mocks.MockProductRepository)
		repo.On("FindByCategoryID", mock.Anything, userID, categoryID).Return([]*entity.Product{&coffee}, nil)

		products, err := query.NewGetProductByCategoryHandler(repo).Handle(context.Background(), query.GetProductByCategoryQuery{
			UserId:     userID,
			CategoryId: categoryID,
		})

		require.NoError(t, err)
		require.Len(t, products, 1)
		assert.Equal(t, coffee.Id().Value(), products[0].ID)
		assert.Equal(t, 10, products[0].Quantity)
		require.NotNil(t, products[0].CategoryId)
		assert.Equal(t, categoryID.Value(), *products[0].CategoryId)
		repo.AssertExpectations(t)
	})

	t.Run("returns an empty list on repository error", func(t *testing.T) {
		repo := new(mocks.MockProductRepository)
		repo.On("FindByCategoryID", mock.Anything, userID, categoryID).Return(nil, boom)

		products, err := query.NewGetProductByCategoryHandler(repo).Handle(context.Background(), query.GetProductByCategoryQuery{
			UserId:     userID,
			CategoryId: categoryID,
		})

		require.ErrorIs(t, err, boom)
		assert.Empty(t, products)
		assert.NotNil(t, products)
	})
}
