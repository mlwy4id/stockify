package valueobject_test

import (
	"math"
	"testing"

	vo "github.com/mlwy4id/stockify/internal/domain/values_object"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func Test_NewStockThreshold_InputValidation(t *testing.T) {
	tests := []struct {
		name    string
		input   int
		want    int
		wantErr bool
	}{
		{name: "accepts zero", input: 0, want: 0},
		{name: "accepts positive", input: 10, want: 10},
		{name: "accepts MaxInt", input: math.MaxInt, want: math.MaxInt},
		{name: "rejects negative", input: -1, wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			threshold, err := vo.NewStockThreshold(tt.input)

			if tt.wantErr {
				require.Error(t, err)
				return
			}

			require.NoError(t, err)
			assert.Equal(t, tt.want, threshold.Value())
		})
	}
}

func Test_ReconstructStockThreshold_Rehydration_Restored(t *testing.T) {
	assert.Equal(t, 4, vo.ReconstructStockThreshold(4).Value())
	// Reconstruct bypasses validation by design (for DB rehydration).
	assert.Equal(t, -2, vo.ReconstructStockThreshold(-2).Value())
}
