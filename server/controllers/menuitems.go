package controllers

import (
	"net/http"
	"strconv"

	"github.com/MikeB1124/display-menu-app/server/db"
	"github.com/MikeB1124/display-menu-app/server/structs"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func AddItemToBoard(c *gin.Context) {
	id := c.Param("boardId")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Must pass a unique id in the query params to add item."})
		return
	}

	var newItem *structs.Item
	if err := c.BindJSON(&newItem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	newItem.Id = primitive.NewObjectID()
	_, err := db.DBAddItemToBoard(id, newItem)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"id": newItem.Id})
}

func DeleteItemFromBoard(c *gin.Context) {
	itemId := c.Param("itemId")
	if itemId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Must pass a unique item id in the query params to remove item."})
		return
	}

	result, err := db.DBDeleteItemFromBoard(itemId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"result": result})
}

func ActiveMenuItem(c *gin.Context) {
	itemId := c.Param("itemId")
	if itemId == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Must pass a unique item id in the query params to remove item."})
		return
	}

	active := c.Param("active")
	if active == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Must pass an active status in params."})
		return
	}
	activeBool, _ := strconv.ParseBool(active)

	result, err := db.DBUpdateActiveItemStatus(itemId, activeBool)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	c.JSON(http.StatusOK, gin.H{"result": result})
}
