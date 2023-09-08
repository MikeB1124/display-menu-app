package utils

import (
	"time"

	"github.com/MikeB1124/display-menu-app/server/configuration"
	"github.com/golang-jwt/jwt"
)

func IsValidUser(u string, p string) bool {
	return u == configuration.Config.Username && p == configuration.Config.Password
}

func WhiteListedIP(ip string) bool {
	for _, WLip := range configuration.Config.WLIPs {
		if ip == WLip {
			return true
		}
	}
	return false
}

func GenerateJWTToken(username string) (string, error) {
	// Define the claims (payload) you want to include in the token
	claims := jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(time.Minute * 3).Unix(), // Token expiration time
	}

	// Create a new token with the claims
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with a secret key to generate the final JWT token
	secretKey := []byte(configuration.Config.JWTSignSecret)
	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
