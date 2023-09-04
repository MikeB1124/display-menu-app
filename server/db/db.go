package db

import (
	"context"
	"log"
	"os"

	"github.com/MikeB1124/display-menu-app/server/structs"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var dbClient *mongo.Client
var dbCollection *mongo.Collection

func Init() {
	dbConnectionStr := os.Getenv("DB_CONNECTION")
	if dbConnectionStr == "" {
		dbConnectionStr = "mongodb://localhost:27017"
	}
	// Set client options
	clientOptions := options.Client().ApplyURI(dbConnectionStr)

	// Connect to MongoDB
	client, err := mongo.Connect(context.TODO(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	// Check the connection
	err = client.Ping(context.TODO(), nil)

	if err != nil {
		log.Fatal(err)
	}
	dbClient = client
	dbCollection = dbClient.Database("trimanaDB").Collection("Boards")
}

func DBConnection() *mongo.Client {
	return dbClient
}

func DBCollection() *mongo.Collection {
	return dbCollection
}

func DBInsertBoard(board *structs.Board) (interface{}, error) {
	insertResult, err := dbCollection.InsertOne(context.TODO(), board)
	if err != nil {
		return nil, err
	}
	return insertResult.InsertedID, nil
}

func DBGetAllBoards() ([]*structs.Board, error) {
	cursor, err := dbCollection.Find(context.TODO(), bson.D{})
	if err != nil {
		return nil, err
	}

	var results []*structs.Board
	if err = cursor.All(context.TODO(), &results); err != nil {
		return nil, err
	}
	return results, nil
}

func DBGetBoardByID(id string) (*structs.Board, error) {
	idPrim, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, err
	}
	var board *structs.Board
	err = dbCollection.FindOne(context.TODO(), bson.D{{Key: "_id", Value: idPrim}}).Decode(&board)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// This error means your query did not match any documents.
			return nil, err
		}
		return nil, err
	}
	return board, nil
}

func DBDeleteBoardByID(id string) (int64, error) {
	idPrim, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return -1, err
	}
	result, err := dbCollection.DeleteOne(context.TODO(), bson.D{{Key: "_id", Value: idPrim}})
	if err != nil {
		return -1, err
	}
	return result.DeletedCount, nil
}

func DBAddItemToBoard(boardId string, item *structs.Item) (*mongo.UpdateResult, error) {
	idPrim, err := primitive.ObjectIDFromHex(boardId)
	if err != nil {
		return nil, err
	}
	filter := bson.D{{Key: "_id", Value: idPrim}}
	update := bson.D{{Key: "$push", Value: bson.D{{Key: "items", Value: item}}}}
	result, err := dbCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return nil, err
	}
	return result, nil
}

func DBDeleteItemFromBoard(itemId string) (*mongo.UpdateResult, error) {
	itemIdPrim, err := primitive.ObjectIDFromHex(itemId)
	if err != nil {
		return nil, err
	}
	filter := bson.D{{Key: "items._id", Value: itemIdPrim}}
	update := bson.D{{Key: "$pull", Value: bson.D{{Key: "items", Value: bson.D{{Key: "_id", Value: itemIdPrim}}}}}}
	result, err := dbCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return nil, err
	}
	return result, err
}

func DBUpdateActiveItemStatus(itemId string, active bool) (*mongo.UpdateResult, error) {
	itemIdPrim, err := primitive.ObjectIDFromHex(itemId)
	if err != nil {
		return nil, err
	}
	filter := bson.D{{Key: "items._id", Value: itemIdPrim}}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "items.$.active", Value: active}}}}
	result, err := dbCollection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return nil, err
	}
	return result, err
}
