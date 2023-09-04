package socket

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var SocketUpgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

var SocketClients = make(map[*websocket.Conn]bool)

func WebSocketConnection(c *gin.Context) {
	conn, err := SocketUpgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}
	defer conn.Close()

	// Add the new WebSocket connection to the clients map
	SocketClients[conn] = true

	for {
		// Read messages from the client (if needed)
		_, _, err := conn.ReadMessage()
		if err != nil {
			delete(SocketClients, conn) // Remove the disconnected client
			c.JSON(http.StatusBadRequest, gin.H{"error": err})
			return
		}
	}
}

func EndpointTriggerAlert(m string) error {
	// Handle the endpoint logic
	// Send a message to connected clients
	message := []byte(m)
	for client := range SocketClients {
		err := client.WriteMessage(websocket.TextMessage, message)
		if err != nil {
			// Handle errors when sending messages
			return err
		}
	}
	return nil
}
