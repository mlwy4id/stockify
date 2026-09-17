package enum_test

import (
	"testing"
	"time"

	"github.com/mlwy4id/stockify/internal/domain/enum"
)

func Test_DateFilter_Duration_ExpectedRange(t *testing.T) {
	tests := []struct {
		name   string
		filter enum.DateFilter
		want   time.Duration
	}{
		{name: "1d", filter: enum.Filter1d, want: 24 * time.Hour},
		{name: "1w", filter: enum.Filter1w, want: 7 * 24 * time.Hour},
		{name: "1m", filter: enum.Filter1m, want: 30 * 24 * time.Hour},
		{name: "3m", filter: enum.Filter3m, want: 90 * 24 * time.Hour},
		{name: "6m", filter: enum.Filter6m, want: 180 * 24 * time.Hour},
		{name: "1y", filter: enum.Filter1y, want: 365 * 24 * time.Hour},
		{name: "unknown returns zero", filter: enum.DateFilter("nope"), want: 0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.filter.Duration(); got != tt.want {
				t.Errorf("Duration() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_DateFilter_IsValid_ExpectedFlags(t *testing.T) {
	tests := []struct {
		name   string
		filter enum.DateFilter
		want   bool
	}{
		{name: "1d", filter: enum.Filter1d, want: true},
		{name: "1w", filter: enum.Filter1w, want: true},
		{name: "1m", filter: enum.Filter1m, want: true},
		{name: "3m", filter: enum.Filter3m, want: true},
		{name: "6m", filter: enum.Filter6m, want: true},
		{name: "1y", filter: enum.Filter1y, want: true},
		{name: "unknown", filter: enum.DateFilter("nope"), want: false},
		{name: "empty", filter: enum.DateFilter(""), want: false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.filter.IsValid(); got != tt.want {
				t.Errorf("IsValid() = %v, want %v", got, tt.want)
			}
		})
	}
}
