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

func Test_ProductStatus_IsValid_ExpectedFlags(t *testing.T) {
	tests := []struct {
		status query.GetAllProductsStatus
		want   bool
	}{
		{status: query.GetAllProductsStatusActive, want: true},
		{status: query.GetAllProductsStatusArchived, want: true},
		{status: query.GetAllProductsStatusAll, want: true},
		{status: query.GetAllProductsStatus("inactive"), want: false},
		{status: query.GetAllProductsStatus(""), want: false},
	}

	for _, tt := range tests {
		t.Run(string(tt.status), func(t *testing.T) {
			assert.Equal(t, tt.want, tt.status.IsValid())
		})
	}
}

func Test_GetAllProductsQuery_AllCases_CorrectResults(t *testing.T) {
	userID := vo.NewUserId()
	categoryID := vo.NewCategoryId()
	boom := errors.New("boom")

	t.Run("active status asks for active products", func(t *testing.T) {
		coffee := mocks.MustProductFull(t, userID, "Kopi", "https://img", 10, 3, &categoryID)

		repo := new(mocks.MockProductRepository)
		repo.On("FindAllActive", mock.Anything, userID).Return([]*entity.Product{&coffee}, nil)

		products, err := query.NewGetAllProductsHandler(repo).Handle(context.Background(), query.GetAllProductsQuery{
			UserId: userID,
			Status: query.GetAllProductsStatusActive,
		})

		require.NoError(t, err)
		require.Len(t, products, 1)
		assert.Equal(t, coffee.Id().Value(), products[0].ID)
		assert.Equal(t, "Kopi", products[0].Name)
		assert.Equal(t, 10, products[0].Quantity)
		assert.False(t, products[0].IsArchived)
		require.NotNil(t, products[0].ImageUrl)
		assert.Equal(t, "https://img", *products[0].ImageUrl)
		require.NotNil(t, products[0].CategoryId)
		assert.Equal(t, categoryID.Value(), *products[0].CategoryId)
		repo.AssertExpectations(t)
	})

	t.Run("archived status asks for archived products", func(t *testing.T) {
		archived := mocks.MustArchivedProduct(t, userID, "Teh", 5, 2)

		repo := new(mocks.MockProductRepository)
		repo.On("FindAllArchived", mock.Anything, userID).Return([]*entity.Product{&archived}, nil)

		products, err := query.NewGetAllProductsHandler(repo).Handle(context.Background(), query.GetAllProductsQuery{
			UserId: userID,
			Status: query.GetAllProductsStatusArchived,
		})

		require.NoError(t, err)
		require.Len(t, products, 1)
		assert.True(t, products[0].IsArchived)
		assert.Nil(t, products[0].ImageUrl, "an empty image url must not be serialised")
		assert.Nil(t, products[0].CategoryId)
		repo.AssertExpectations(t)
	})

	t.Run("all status asks for every product", func(t *testing.T) {
		coffee := mocks.MustProductFull(t, userID, "Kopi", "", 10, 3, nil)
		tea := mocks.MustArchivedProduct(t, userID, "Teh", 5, 2)

		repo := new(mocks.MockProductRepository)
		repo.On("FindAll", mock.Anything, userID).Return([]*entity.Product{&coffee, &tea}, nil)

		products, err := query.NewGetAllProductsHandler(repo).Handle(context.Background(), query.GetAllProductsQuery{
			UserId: userID,
			Status: query.GetAllProductsStatusAll,
		})

		require.NoError(t, err)
		assert.Len(t, products, 2)
		repo.AssertExpectations(t)
	})

	t.Run("an unknown status falls back to active products", func(t *testing.T) {
		repo := new(mocks.MockProductRepository)
		repo.On("FindAllActive", mock.Anything, userID).Return([]*entity.Product{}, nil)

		products, err := query.NewGetAllProductsHandler(repo).Handle(context.Background(), query.GetAllProductsQuery{
			UserId: userID,
			Status: query.GetAllProductsStatus("whatever"),
		})

		require.NoError(t, err)
		assert.Empty(t, products)
		repo.AssertExpectations(t)
	})

	t.Run("propagates the repository error", func(t *testing.T) {
		repo := new(mocks.MockProductRepository)
		repo.On("FindAllActive", mock.Anything, userID).Return(nil, boom)

		_, err := query.NewGetAllProductsHandler(repo).Handle(context.Background(), query.GetAllProductsQuery{
			UserId: userID,
			Status: query.GetAllProductsStatusActive,
		})

		require.ErrorIs(t, err, boom)
	})
}
