package mocks

import (
	"context"
	"time"

	"github.com/mlwy4id/stockify/internal/application/ports"
	"github.com/mlwy4id/stockify/internal/domain/entity"
	"github.com/mlwy4id/stockify/internal/domain/enum"
	domRepo "github.com/mlwy4id/stockify/internal/domain/repository"
	"github.com/mlwy4id/stockify/internal/domain/service"
	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

// Compile-time guarantee that every mock still satisfies the interface it stands in for.
// Without these assertions a mock can silently drift from its port until the first test uses it.
var (
	_ domRepo.UserRepository          = (*MockUserRepository)(nil)
	_ domRepo.CategoryRepository      = (*MockCategoryRepository)(nil)
	_ domRepo.ProductRepository       = (*MockProductRepository)(nil)
	_ ports.FileStorage               = (*MockFileStorage)(nil)
	_ service.CategoryDeletionService = (*MockCategoryDeletionService)(nil)
)

// FixedTime is a deterministic timestamp for tests (avoids flaky now()).
func FixedTime() time.Time {
	return time.Date(2026, 9, 15, 10, 0, 0, 0, time.UTC)
}

// Ptr returns a pointer to v, for filling optional (*T) entity/DTO fields.
func Ptr[T any](v T) *T {
	return &v
}

// --- Fixture builders (fail fast via require) ---

func MustUserID(t require.TestingT) vo.UserId { return vo.NewUserId() }

func MustCategoryID(t require.TestingT) vo.CategoryId { return vo.NewCategoryId() }

func MustQuantity(t require.TestingT, v int) vo.Quantity {
	q, err := vo.NewQuantity(v)
	require.NoError(t, err)
	return q
}

func MustThreshold(t require.TestingT, v int) vo.StockThreshold {
	s, err := vo.NewStockThreshold(v)
	require.NoError(t, err)
	return s
}

func MustEmail(t require.TestingT, v string) vo.Email {
	e, err := vo.NewEmail(v)
	require.NoError(t, err)
	return e
}

func MustProduct(t require.TestingT, userID vo.UserId, qty int) entity.Product {
	p, err := entity.NewProduct(userID, "Kopi Susu", "", MustQuantity(t, qty), MustThreshold(t, 5), nil)
	require.NoError(t, err)
	return p
}

func MustProductWithName(t require.TestingT, userID vo.UserId, name string, qty int) entity.Product {
	p, err := entity.NewProduct(userID, name, "", MustQuantity(t, qty), MustThreshold(t, 5), nil)
	require.NoError(t, err)
	return p
}

func MustCategory(t require.TestingT, userID vo.UserId, name string) entity.Category {
	c, err := entity.NewCategory(userID, name)
	require.NoError(t, err)
	return c
}

// MustProductFull builds an active product with full control over name, image, quantity,
// threshold and category (fixtures above keep the defaults used by the entity tests).
func MustProductFull(t require.TestingT, userID vo.UserId, name string, imageUrl string, qty int, threshold int, categoryID *vo.CategoryId) entity.Product {
	p, err := entity.NewProduct(userID, name, imageUrl, MustQuantity(t, qty), MustThreshold(t, threshold), categoryID)
	require.NoError(t, err)
	return p
}

// MustArchivedProduct builds a rehydrated (already archived) product, bypassing the
// constructor the same way the repository mapper does.
func MustArchivedProduct(t require.TestingT, userID vo.UserId, name string, qty int, threshold int) entity.Product {
	return entity.ReconstructProduct(
		vo.NewProductId(), userID, name, "", MustQuantity(t, qty), MustThreshold(t, threshold), nil, nil, Ptr(FixedTime()),
	)
}

func MustUser(t require.TestingT, email string, name string, passwordHash string) entity.User {
	u, err := entity.NewUser(MustEmail(t, email), name, passwordHash)
	require.NoError(t, err)
	return u
}

// MustStockMovement builds a rehydrated stock movement (same path the DB mapper uses).
func MustStockMovement(t require.TestingT, userID vo.UserId, productID vo.ProductId, action enum.Action, quantity int, balance int, date time.Time) entity.StockMovement {
	return entity.ReconstructStockMovement(vo.NewStockMovementId(), userID, productID, string(action), quantity, balance, nil, nil, date)
}

// MustStockMovementWithNote is MustStockMovement plus source/reason metadata.
func MustStockMovementWithNote(t require.TestingT, userID vo.UserId, productID vo.ProductId, action enum.Action, quantity int, balance int, source string, reason string, date time.Time) entity.StockMovement {
	return entity.ReconstructStockMovement(vo.NewStockMovementId(), userID, productID, string(action), quantity, balance, Ptr(source), Ptr(reason), date)
}

func MustStockMovementWithProduct(t require.TestingT, sm entity.StockMovement, productName string) entity.StockMovementWithProduct {
	return entity.StockMovementWithProduct{StockMovement: sm, ProductName: productName}
}

// --- MockUserRepository ---

type MockUserRepository struct{ mock.Mock }

func (m *MockUserRepository) Save(ctx context.Context, user *entity.User) error {
	return m.Called(ctx, user).Error(0)
}

func (m *MockUserRepository) FindByID(ctx context.Context, id vo.UserId) (*entity.User, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entity.User), args.Error(1)
}

func (m *MockUserRepository) FindByEmail(ctx context.Context, email string) (*entity.User, error) {
	args := m.Called(ctx, email)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entity.User), args.Error(1)
}

// --- MockCategoryRepository ---

type MockCategoryRepository struct{ mock.Mock }

func (m *MockCategoryRepository) Save(ctx context.Context, category *entity.Category) error {
	return m.Called(ctx, category).Error(0)
}

func (m *MockCategoryRepository) FindByID(ctx context.Context, userID vo.UserId, id vo.CategoryId) (*entity.Category, error) {
	args := m.Called(ctx, userID, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entity.Category), args.Error(1)
}

func (m *MockCategoryRepository) FindAll(ctx context.Context, userID vo.UserId) ([]*entity.Category, error) {
	args := m.Called(ctx, userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entity.Category), args.Error(1)
}

// --- MockProductRepository (14 methods) ---

type MockProductRepository struct{ mock.Mock }

func (m *MockProductRepository) Save(ctx context.Context, product *entity.Product) error {
	return m.Called(ctx, product).Error(0)
}

func (m *MockProductRepository) FindByID(ctx context.Context, userID vo.UserId, id vo.ProductId) (*entity.Product, error) {
	args := m.Called(ctx, userID, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*entity.Product), args.Error(1)
}

func (m *MockProductRepository) FindAllActive(ctx context.Context, userID vo.UserId) ([]*entity.Product, error) {
	args := m.Called(ctx, userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entity.Product), args.Error(1)
}

func (m *MockProductRepository) FindAllArchived(ctx context.Context, userID vo.UserId) ([]*entity.Product, error) {
	args := m.Called(ctx, userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entity.Product), args.Error(1)
}

func (m *MockProductRepository) FindAll(ctx context.Context, userID vo.UserId) ([]*entity.Product, error) {
	args := m.Called(ctx, userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entity.Product), args.Error(1)
}

func (m *MockProductRepository) FindByCategoryID(ctx context.Context, userID vo.UserId, categoryID vo.CategoryId) ([]*entity.Product, error) {
	args := m.Called(ctx, userID, categoryID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entity.Product), args.Error(1)
}

func (m *MockProductRepository) GetStockMovementsByProductID(ctx context.Context, userID vo.UserId, productID vo.ProductId, asc bool) ([]*entity.StockMovement, error) {
	args := m.Called(ctx, userID, productID, asc)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entity.StockMovement), args.Error(1)
}

func (m *MockProductRepository) GetStockMovementsByProductIDAndDateRange(ctx context.Context, userID vo.UserId, productID vo.ProductId, start time.Time, end time.Time) ([]*entity.StockMovement, error) {
	args := m.Called(ctx, userID, productID, start, end)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entity.StockMovement), args.Error(1)
}

func (m *MockProductRepository) GetAllStockMovements(ctx context.Context, userID vo.UserId) ([]*entity.StockMovement, error) {
	args := m.Called(ctx, userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entity.StockMovement), args.Error(1)
}

func (m *MockProductRepository) GetAllStockMovementsAndDateRange(ctx context.Context, userID vo.UserId, start time.Time, end time.Time) ([]*entity.StockMovement, error) {
	args := m.Called(ctx, userID, start, end)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entity.StockMovement), args.Error(1)
}

func (m *MockProductRepository) GetAllStockMovementsWithProduct(ctx context.Context, userID vo.UserId) ([]*entity.StockMovementWithProduct, error) {
	args := m.Called(ctx, userID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entity.StockMovementWithProduct), args.Error(1)
}

func (m *MockProductRepository) GetAllStockMovementsAndDateRangeWithProduct(ctx context.Context, userID vo.UserId, start time.Time, end time.Time) ([]*entity.StockMovementWithProduct, error) {
	args := m.Called(ctx, userID, start, end)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).([]*entity.StockMovementWithProduct), args.Error(1)
}

func (m *MockProductRepository) GetTotalQuantity(ctx context.Context, userID vo.UserId) (int, error) {
	args := m.Called(ctx, userID)
	return args.Int(0), args.Error(1)
}

func (m *MockProductRepository) RemoveCategoryByCategoryId(ctx context.Context, userID vo.UserId, categoryID vo.CategoryId) error {
	return m.Called(ctx, userID, categoryID).Error(0)
}

// --- MockFileStorage ---

type MockFileStorage struct{ mock.Mock }

func (m *MockFileStorage) Upload(ctx context.Context, path string, data []byte, contentType string) (string, error) {
	args := m.Called(ctx, path, data, contentType)
	return args.String(0), args.Error(1)
}

func (m *MockFileStorage) Delete(ctx context.Context, path string) error {
	return m.Called(ctx, path).Error(0)
}

func (m *MockFileStorage) GenerateSignedUploadURL(ctx context.Context, path string, contentType string) (string, error) {
	args := m.Called(ctx, path, contentType)
	return args.String(0), args.Error(1)
}

func (m *MockFileStorage) GetPublicURL(path string) string {
	args := m.Called(path)
	return args.String(0)
}

// --- MockCategoryDeletionService ---

type MockCategoryDeletionService struct{ mock.Mock }

func (m *MockCategoryDeletionService) DeleteCategoryWithCascade(ctx context.Context, userID vo.UserId, categoryID vo.CategoryId) error {
	return m.Called(ctx, userID, categoryID).Error(0)
}
