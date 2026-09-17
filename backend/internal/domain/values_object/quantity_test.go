package valueobject_test

import (
	"math"
	"testing"

	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_NewQuantity_InputValidation(t *testing.T) {
	tests := []struct {
		name    string
		input   int
		want    int
		wantErr bool
	}{
		{name: "accepts zero", input: 0, want: 0},
		{name: "accepts positive", input: 5, want: 5},
		{name: "accepts large", input: 1_000_000, want: 1_000_000},
		{name: "accepts MaxInt", input: math.MaxInt, want: math.MaxInt},
		{name: "rejects negative", input: -1, wantErr: true},
		{name: "rejects large negative", input: -999, wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			quantity, err := vo.NewQuantity(tt.input)

			if tt.wantErr {
				require.Error(t, err)
				return
			}

			require.NoError(t, err)
			assert.Equal(t, tt.want, quantity.Value())
		})
	}
}

func Test_Quantity_Add_ExpectedSum(t *testing.T) {
	left := vo.ReconstructQuantity(5)
	right := vo.ReconstructQuantity(3)

	assert.Equal(t, 8, left.Add(right).Value(), "5 + 3 should be 8")
	assert.Equal(t, 5, left.Add(vo.ReconstructQuantity(0)).Value(), "5 + 0 should be 5")
	// Immutability: receiver must not change.
	assert.Equal(t, 5, left.Value(), "Add must not mutate receiver")
}

func Test_Quantity_Subtract_ExpectedDifference(t *testing.T) {
	tests := []struct {
		name    string
		from    int
		amount  int
		want    int
		wantErr bool
	}{
		{name: "subtracts normally", from: 5, amount: 3, want: 2},
		{name: "allows reaching zero", from: 3, amount: 3, want: 0},
		{name: "zero minus zero", from: 0, amount: 0, want: 0},
		{name: "rejects going negative", from: 3, amount: 5, wantErr: true},
		{name: "rejects zero minus positive", from: 0, amount: 1, wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result, err := vo.ReconstructQuantity(tt.from).Subtract(vo.ReconstructQuantity(tt.amount))

			if tt.wantErr {
				require.Error(t, err)
				return
			}

			require.NoError(t, err)
			assert.Equal(t, tt.want, result.Value())
		})
	}
}

func Test_ReconstructQuantity_Rehydration_Restored(t *testing.T) {
	assert.Equal(t, 7, vo.ReconstructQuantity(7).Value())
	// Reconstruct bypasses validation by design (for DB rehydration).
	assert.Equal(t, -3, vo.ReconstructQuantity(-3).Value())
}
