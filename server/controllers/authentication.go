package controllers

import (
	"encoding/base64"
	"net/http"
	"strings"

	"github.com/MikeB1124/display-menu-app/server/authservice"
	"github.com/gin-gonic/gin"
)

func BasicAuthMiddleware(c *gin.Context) {
	// Get the Authorization header
	authHeader := c.GetHeader("Authorization")

	// Check if the header is empty
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		c.Abort()
		return
	}

	// Extract the Basic Auth credentials
	auth := strings.SplitN(authHeader, " ", 2)
	if len(auth) != 2 || auth[0] != "Basic" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		c.Abort()
		return
	}

	// Decode the credentials
	decoded, err := base64.StdEncoding.DecodeString(auth[1])
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		c.Abort()
		return
	}

	// Split the credentials into username and password
	credentials := strings.SplitN(string(decoded), ":", 2)
	if len(credentials) != 2 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		c.Abort()
		return
	}

	// Check if the username and password match your expected values
	username := credentials[0]
	password := credentials[1]

	// Replace this with your actual username and password validation logic
	if !authservice.IsValidUser(username, password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		c.Abort()
		return
	}

	// If authentication is successful, continue to the next middleware or roIsValidUser(u string, p string)
	c.Next()
}
