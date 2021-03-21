package models

type SubmitVoteRequest struct {
	ID        string         `json:"id"`
	VoteCount map[string]int `json:"vote_count"`
	Uid       string         `json:"uid"`
	MyVote    string         `json:"my_vote,omitempty"`
}
