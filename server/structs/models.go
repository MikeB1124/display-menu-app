package structs

import "go.mongodb.org/mongo-driver/bson/primitive"

type Board struct {
	Id          primitive.ObjectID `json:"_id" bson:"_id"`
	DisplayName string             `json:"displayName" bson:"displayName"`
	Items       []Item             `json:"items" bson:"items"`
}

type Item struct {
	Id          primitive.ObjectID `json:"_id" bson:"_id"`
	Name        string             `json:"name" bson:"name"`
	Description string             `json:"description" bson:"description"`
	Price       string             `json:"price" bson:"price"`
	ImageURL    string             `json:"imageURL" bson:"imageURL"`
	Active      bool               `json:"active" bson:"active"`
}

type UserAccount struct {
	Username string `json:"username" bson:"username"`
	Password string `json:"password" bson:"password"`
}
