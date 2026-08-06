package stockmovement

import "math"

func roundPercentage(value float64) float64 {
	return math.Round(value*100) / 100
}
