package models

type Poll struct {
	ID        string            `json:"id,omitempty" bson:"_id,omitempty"`
	Owner     string            `json:"owner,omitempty"`
	Active    bool              `json:"active"`
	Title     string            `json:"title"`
	Options   []string          `json:"options"`
	Votes     map[string]string `json:"votes"`
	VoteCount map[string]int    `json:"vote_count"`
}
