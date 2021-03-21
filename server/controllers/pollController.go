package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/skmonir/epoll/models"
	"github.com/skmonir/epoll/services"
)

func CreateNewPoll(ctx *fiber.Ctx) error {
	var poll models.Poll
	err := ctx.BodyParser(&poll)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	poll, err = services.CreatePoll(poll)
	if err != nil {
		return ctx.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(poll)
}

func UpdatePoll(ctx *fiber.Ctx) error {
	var pollRequest models.SubmitVoteRequest
	err := ctx.BodyParser(&pollRequest)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	poll, err := services.UpdatePoll(pollRequest)
	if err != nil {
		return ctx.Status(fiber.StatusBadGateway).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	services.BroadcastNewPollUpdate(poll)

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"isSuccessful": true,
	})
}

func GetPollDetail(ctx *fiber.Ctx) error {
	id := ctx.Params("pollId")

	poll, err := services.GetPoll(id)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(poll)
}