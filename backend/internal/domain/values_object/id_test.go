package valueobject_test

import (
	"sync"
	"testing"

	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_NewID_RepeatedGeneration_UniqueValues(t *testing.T) {
	tests := []struct {
		name string
		newA func() string
		newB func() string
	}{
		{name: "UserId", newA: func() string { return vo.NewUserId().Value() }, newB: func() string { return vo.NewUserId().Value() }},
		{name: "ProductId", newA: func() string { return vo.NewProductId().Value() }, newB: func() string { return vo.NewProductId().Value() }},
		{name: "CategoryId", newA: func() string { return vo.NewCategoryId().Value() }, newB: func() string { return vo.NewCategoryId().Value() }},
		{name: "StockMovementId", newA: func() string { return vo.NewStockMovementId().Value() }, newB: func() string { return vo.NewStockMovementId().Value() }},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			first := tt.newA()
			second := tt.newB()

			assert.NotEmpty(t, first, "expected non-empty id")
			assert.NotEqual(t, first, second, "expected unique ids")
		})
	}
}

func Test_NewID_ConcurrentGeneration_UniqueValues(t *testing.T) {
	const n = 100
	seen := make(map[string]struct{}, n)
	var mu sync.Mutex
	var wg sync.WaitGroup
	for i := 0; i < n; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			id := vo.NewUserId().Value()
			mu.Lock()
			seen[id] = struct{}{}
			mu.Unlock()
		}()
	}
	wg.Wait()
	assert.Len(t, seen, n, "concurrent NewUserId should stay unique")
}

func Test_ParseID_InputValidation(t *testing.T) {
	t.Run("UserId", func(t *testing.T) {
		id, err := vo.ParseUserId("user-1")
		require.NoError(t, err)
		assert.Equal(t, "user-1", id.Value())
	})

	t.Run("ProductId", func(t *testing.T) {
		id, err := vo.ParseProductId("product-1")
		require.NoError(t, err)
		assert.Equal(t, "product-1", id.Value())
	})

	t.Run("CategoryId", func(t *testing.T) {
		id, err := vo.ParseCategoryId("category-1")
		require.NoError(t, err)
		assert.Equal(t, "category-1", id.Value())
	})

	t.Run("StockMovementId", func(t *testing.T) {
		id, err := vo.ParseStockMovementId("movement-1")
		require.NoError(t, err)
		assert.Equal(t, "movement-1", id.Value())
	})
}

func Test_ParseID_RoundTrip_ValuePreserved(t *testing.T) {
	uid := vo.NewUserId()
	parsed, err := vo.ParseUserId(uid.Value())
	require.NoError(t, err)
	assert.Equal(t, uid.Value(), parsed.Value())

	pid := vo.NewProductId()
	parsedP, err := vo.ParseProductId(pid.Value())
	require.NoError(t, err)
	assert.Equal(t, pid.Value(), parsedP.Value())
}
