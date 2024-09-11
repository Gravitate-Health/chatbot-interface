import { Router } from "express";
import * as chatController from "../controllers/chatController";

export const ChatbotInterfaceRouter: Router = Router();

ChatbotInterfaceRouter.post("/chat", chatController.chat);
ChatbotInterfaceRouter.get("/chatbots", chatController.listChatbots);
