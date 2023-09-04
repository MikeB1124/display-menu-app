package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	port := os.Getenv("PORT")
	staticFiles := "./client/build"
	if port == "" {
		port = "8080" // Default port if not specified
	}
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
		api.GET("/", func(c *gin.Context) {
			entries, err := os.ReadDir("./client")
			if err != nil {
				log.Fatal(err)
			}

			for _, e := range entries {
				fmt.Println(e.Name())
			}
			c.JSON(http.StatusOK, gin.H{
				"message": "pong",
			})
		})
	}

	// Start and run the server
	router.Run(":" + port)
}
