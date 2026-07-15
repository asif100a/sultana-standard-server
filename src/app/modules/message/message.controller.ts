import type { Request, Response } from "express";
import { MessageService } from "./message.service";
import { catchAsync } from "../../utils/index";
import type { MessageResponseType } from "./message.interface";

const messageService = new MessageService();

export class MessageController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const data = await messageService.findAll();
      res.status(200).json({
        success: true,
        message: "The message data retrieved successfully",
        data,
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }

  async getConversation(req: Request, res: Response): Promise<void> {
    try {
      const { partnerId } = req.params;
      const userId = req.user?.userId;

      if (!partnerId || !userId) {
        throw new Error("Partner ID or User ID not found");
      }

      const data = await messageService.getConversation(userId, partnerId as string);
      res.status(200).json({
        success: true,
        message: "Conversation retrieved successfully",
        data,
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    const paramsId = req.params.id;
    if (!paramsId) {
      throw new Error("Id not found!");
    }
    try {
      const data = await messageService.findById(paramsId as string);
      if (!data) {
        res.status(404).json({
          success: false,
          message: "Message not found",
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "The message data retrieved successfully",
        data,
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }

      const data = await messageService.createForUser(userId, req.body);
      res.status(201).json({
        success: true,
        message: "The message data created successfully",
        data,
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const paramsId = req.params.id;
    if (!paramsId) {
      throw new Error("Id not found!");
    }
    try {
      const data = await messageService.update(paramsId as string, req.body);
      res.status(200).json({
        success: true,
        message: "The message data updated successfully",
        data,
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const paramsId = req.params.id;
      if (!paramsId) {
        throw new Error("Id not found!");
      }
      await messageService.delete(paramsId as string);
      res.status(200).json({
        success: true,
        message: "The message data deleted successfully",
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }
}
