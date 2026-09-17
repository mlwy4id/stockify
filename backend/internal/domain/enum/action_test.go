package enum_test

import (
	"testing"

	"github.com/mlwy4id/stockify/internal/domain/enum"
	"github.com/stretchr/testify/assert"
)

func Test_Action_IsValid_ExpectedFlags(t *testing.T) {
	tests := []struct {
		name   string
		action enum.Action
		want   bool
	}{
		{name: "restock", action: enum.Restock, want: true},
		{name: "refund", action: enum.Refund, want: true},
		{name: "sold", action: enum.Sold, want: true},
		{name: "broken", action: enum.Broken, want: true},
		{name: "unknown", action: enum.Action("UNKNOWN"), want: false},
		{name: "empty", action: enum.Action(""), want: false},
		{name: "lowercase", action: enum.Action("sold"), want: false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.want, tt.action.IsValid())
		})
	}
}

func Test_Action_String_ExpectedLabel(t *testing.T) {
	tests := []struct {
		action enum.Action
		want   string
	}{
		{action: enum.Restock, want: "RESTOCK"},
		{action: enum.Refund, want: "REFUND"},
		{action: enum.Sold, want: "SOLD"},
		{action: enum.Broken, want: "BROKEN"},
	}

	for _, tt := range tests {
		t.Run(tt.want, func(t *testing.T) {
			assert.Equal(t, tt.want, tt.action.String())
			assert.True(t, tt.action.IsValid(), "String() value should stay IsValid")
		})
	}
}
