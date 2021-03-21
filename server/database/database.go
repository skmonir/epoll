package database

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"time"
)

const (
	dbName   = "epoll"
	mongoURI = "mongodb://localhost:27017/" + dbName
)

func connectToDatabase() (*mongo.Client, error) {
	client, err := mongo.NewClient(options.Client().ApplyURI(mongoURI))
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		return nil, err
	}

	log.Println("Connected to the database...")

	return client, nil
}

func GetDatabaseCollection(collectionName string) (*mongo.Collection, error) {
	client, err := connectToDatabase()
	if err != nil {
		return nil, err
	}

	collection := client.Database(dbName).Collection(collectionName)

	return collection, nil
}
