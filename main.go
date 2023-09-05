package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/MikeB1124/display-menu-app/server/controllers"
	"github.com/MikeB1124/display-menu-app/server/db"
	"github.com/MikeB1124/display-menu-app/server/socket"
	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

type PortConfiguration struct {
	Port string `json:"port"`
}

func writePort(port string) {
	configPort := PortConfiguration{
		Port: port,
	}
	jsonData, err := json.Marshal(configPort)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		return
	}

	file, err := os.Create("portconfig.json")
	if err != nil {
		fmt.Println("Error creating file:", err)
		return
	}
	defer file.Close()

	// Write the JSON-encoded data to the file.
	_, err = file.Write(jsonData)
	if err != nil {
		fmt.Println("Error writing JSON to file:", err)
		return
	}
}

func main() {
	db.Init()
	port := os.Getenv("PORT")
	staticFiles := "./client/build"
	if port == "" {
		port = "8080" // Default port if not specified
	}
	writePort(port)
	// Set the router as the default one shipped with Gin
	router := gin.Default()

	// Serve frontend static files
	staticServer := static.Serve("/", static.LocalFile(staticFiles, true))
	router.Use(staticServer)

	router.NoRoute(func(c *gin.Context) {
		if c.Request.Method == http.MethodGet &&
			!strings.ContainsRune(c.Request.URL.Path, '.') &&
			!strings.HasPrefix(c.Request.URL.Path, "/api/") {
			c.Request.URL.Path = "/"
			staticServer(c)
		}
	})

	// Setup route group for the API
	api := router.Group("/api")
	{
		api.GET("/ws", socket.WebSocketConnection)

		boards := api.Group("/boards")
		boards.GET("/", controllers.GetAllBoards)
		boards.POST("/", controllers.CreateMenuBoard)
		boards.DELETE("/:id", controllers.DeleteBoardByID)

		menuItems := api.Group("/menuItems")
		menuItems.PATCH("/:boardId", controllers.AddItemToBoard)
		menuItems.PATCH("/remove/:itemId", controllers.DeleteItemFromBoard)
		menuItems.PATCH("/active/:itemId/:active", controllers.ActiveMenuItem)
	}

	// Start and run the server
	router.Run(":" + port)
}
