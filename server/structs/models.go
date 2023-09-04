package structs

import "go.mongodb.org/mongo-driver/bson/primitive"

type Board struct {
	DisplayName string `json:"displayName" bson:"displayName"`
	Items       []Item `json:"items" bson:"items"`
}

type Item struct {
	ID          primitive.ObjectID `json:"id" bson:"id"`
	Name        string             `json:"name" bson:"name"`
	Description string             `json:"description" bson:"description"`
	Price       string             `json:"price" bson:"price"`
	ImageURL    string             `json:"imageURL" bson:"imageURL"`
	Active      bool               `json:"active" bson:"active"`
}
