package enum

type Action string

const (
	Restock Action = "RESTOCK"
	Refund  Action = "REFUND"
	Sold    Action = "SOLD"
	Broken  Action = "BROKEN"
)

func (a Action) IsValid() bool {
	switch a {
	case Restock, Refund, Sold, Broken:
		return true
	}
	return false
}

func (a Action) String() string {
	return string(a)
}
