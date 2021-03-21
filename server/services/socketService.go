package services

import (
	"github.com/gofiber/websocket/v2"
	"github.com/skmonir/epoll/models"
	"log"
)

type socketClient struct {
	conn *websocket.Conn
	pollId string
}

var socketClients = make(map[*websocket.Conn]string)
var socketClients2 = make(map[string]map[*websocket.Conn]bool)

var registerChan = make(chan socketClient)
var unregisterChan = make(chan *websocket.Conn)
var broadcastChan = make(chan models.Poll)

func RunSocketHub() {
	for {
		select {
		case client := <-registerChan:
			socketClients[client.conn] = client.pollId
			if _, ok := socketClients2[client.pollId]; !ok {
				socketClients2[client.pollId] = make(map[*websocket.Conn]bool)
			}
			socketClients2[client.pollId][client.conn] = true

		case client := <-unregisterChan:
			log.Println("client gone")
			pollId, _ := socketClients[client]
			delete(socketClients2[pollId], client)
			if len(socketClients2[pollId]) == 0 {
				delete(socketClients2, pollId)
			}
			delete(socketClients, client)

		case poll := <-broadcastChan:
			log.Println(len(socketClients))
			for client := range socketClients2[poll.ID] {
				if err := client.WriteJSON(poll); err != nil {
					unregisterChan <- client
					client.Close()
				}
			}
		}
	}
}

func CreateNewSocketConnection(conn *websocket.Conn) {
	// When the function returns, unregister the client and close the connection
	defer func() {
		log.Println("Client disconnected, closing the connection...")
		unregisterChan <- conn
		conn.Close()
	}()

	// Register the client
	//registerChan <- conn
	log.Println("New client connected though the socket")

	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Println("read error:", err)
			}
			return // Calls the deferred function, i.e. closes the connection on error
		}

		if messageType == websocket.TextMessage {
			// Broadcast the received message
			newClient := socketClient{
				conn: conn,
				pollId: string(message),
			}
			registerChan <- newClient
		} else {
			log.Println("websocket message received of type", messageType)
		}
	}
}

func BroadcastNewPollUpdate(poll models.Poll) {
	broadcastChan <- poll
}