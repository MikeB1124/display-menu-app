package controllers

import (
	"net/http"

	"github.com/MikeB1124/display-menu-app/server/db"
	"github.com/MikeB1124/display-menu-app/server/structs"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateMenuBoard(c *gin.Context) {
	var newBoard structs.Board
	if err := c.BindJSON(&newBoard); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	newBoard.Id = primitive.NewObjectID()
	result, err := db.DBInsertBoard(&newBoard)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": result})
}

func GetAllBoards(c *gin.Context) {
	result, err := db.DBGetAllBoards()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"result": result})
}

func DeleteBoardByID(c *gin.Context) {
	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Must pass a unique id in the query params to delete a board."})
		return
	}
	deletedCount, err := db.DBDeleteBoardByID(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if int(deletedCount) == 0 {
		c.JSON(http.StatusOK, gin.H{"result": "No matching documents to delete"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"result": deletedCount})
}
