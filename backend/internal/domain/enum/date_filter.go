package enum

import "time"

type DateFilter string

const (
	Filter1d DateFilter = "1d"
	Filter1w DateFilter = "1w"
	Filter1m DateFilter = "1m"
	Filter3m DateFilter = "3m"
	Filter6m DateFilter = "6m"
	Filter1y DateFilter = "1y"
)

func (df DateFilter) Duration() time.Duration {
	switch df {
	case Filter1d:
		return 24 * time.Hour
	case Filter1w:
		return 7 * 24 * time.Hour
	case Filter1m:
		return 30 * 24 * time.Hour
	case Filter3m:
		return 90 * 24 * time.Hour
	case Filter6m:
		return 180 * 24 * time.Hour
	case Filter1y:
		return 365 * 24 * time.Hour
	default:
		return 0
	}
}

func (df DateFilter) IsValid() bool {
	switch df {
	case Filter1d, Filter1w, Filter1m, Filter3m, Filter6m, Filter1y:
		return true
	}
	return false
}
