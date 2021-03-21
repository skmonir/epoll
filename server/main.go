package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/skmonir/epoll/services"
	"log"

	"github.com/skmonir/epoll/routes"
)

func main() {
	go services.RunSocketHub()

	app := fiber.New()

	app.Use(cors.New())
	app.Use(logger.New())

	app.Static("/", "./home.html")

	//pollApi := app.Group("/api/v1")
	routes.SetPollRoutes(app.Group("/api/v1"))

	log.Fatal(app.Listen(":8000"))
}