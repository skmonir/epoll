package services

import (
	"context"
	"github.com/skmonir/epoll/database"
	"github.com/skmonir/epoll/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreatePoll(poll models.Poll) (models.Poll, error) {
	collection, err := database.GetDatabaseCollection("POLLS")
	if err != nil {
		return models.Poll{}, err
	}

	res, err := collection.InsertOne(context.Background(), poll)
	if err != nil {
		return models.Poll{}, err
	}

	insertedPoll := models.Poll{}
	filter := bson.M{"_id" : res.InsertedID}
	err = collection.FindOne(context.Background(), filter).Decode(&insertedPoll)

	if err != nil {
		return models.Poll{}, err
	}

	return insertedPoll, nil
}

func GetPoll(pollId string) (models.Poll, error) {
	collection, err := database.GetDatabaseCollection("POLLS")
	if err != nil {
		return models.Poll{}, err
	}

	objId, err := primitive.ObjectIDFromHex(pollId)
	if err != nil {
		return models.Poll{}, err
	}

	poll := models.Poll{}
	filter := bson.M{"_id" : objId}
	err = collection.FindOne(context.Background(), filter).Decode(&poll)

	if err != nil {
		return models.Poll{}, err
	}

	return poll, nil
}

func UpdatePoll(pollRequest models.SubmitVoteRequest) (models.Poll, error) {
	collection, err := database.GetDatabaseCollection("POLLS")
	if err != nil {
		return models.Poll{}, err
	}

	originalPoll, err := GetPoll(pollRequest.ID)
	if err != nil {
		return models.Poll{}, err
	}

	votes := originalPoll.Votes
	votes[pollRequest.Uid] = pollRequest.MyVote

	objId, err := primitive.ObjectIDFromHex(pollRequest.ID)
	if err != nil {
		return models.Poll{}, err
	}

	filter := bson.M{"_id" : objId}
	updateQuery := bson.D{
		{"votecount", pollRequest.VoteCount},
		{"votes", votes},
	}
	update := bson.M{"$set": updateQuery}
	_, err = collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return models.Poll{}, err
	}

	return GetPoll(pollRequest.ID)
}
