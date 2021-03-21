package routes

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
	"github.com/skmonir/epoll/controllers"
	"github.com/skmonir/epoll/services"
)

func SetPollRoutes(app fiber.Router) {
	app.Get("/ws", websocket.New(func(conn *websocket.Conn) {
		services.CreateNewSocketConnection(conn)
	}))
	app.Post("/createNewPoll", controllers.CreateNewPoll)
	app.Put("/updatePoll", controllers.UpdatePoll)
	app.Get("/getPoll/:pollId", controllers.GetPollDetail)
}