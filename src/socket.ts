import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyFirebaseToken } from "./app/config/firebase";
import { UserModel } from "./app/modules/user/user.model";
import { MessageService } from "./app/modules/message/message.service";

const messageService = new MessageService();

export function initializeSocket(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*", // allow frontend connection
    },
  });

  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }
      
      const decoded = await verifyFirebaseToken(token);
      if (!decoded || !decoded.uid) {
        return next(new Error("Authentication error: Invalid token"));
      }

      const user = await UserModel.findOne({ firebaseUid: decoded.uid });
      if (!user) {
        return next(new Error("Authentication error: User not found in DB"));
      }

      if (!user.isVerified) {
        return next(new Error("Authentication error: User is not verified"));
      }

      // Attach userId to the socket
      (socket as any).userId = user._id.toString();
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).userId;
    console.log(`🔌 User connected to socket: ${userId}`);

    // Join a room specifically for this user to receive personal messages
    socket.join(userId);

    // Handle sending message
    socket.on("sendMessage", async (data: { receiverId: string; text?: string; imageUrl?: string }, callback) => {
      try {
        const { receiverId, text, imageUrl } = data;
        
        if (!receiverId || (!text && !imageUrl)) {
          if(callback) callback({ success: false, error: "Invalid payload" });
          return;
        }

        if (receiverId === userId) {
          if(callback) callback({ success: false, error: "You cannot chat with your own account" });
          return;
        }

        const message = await messageService.createForUser(userId, {
          receiver: receiverId,
          text: text || "",
          imageUrl: imageUrl || "",
        });

        // Emit to receiver
        io.to(receiverId).emit("receiveMessage", message);

        if(callback) callback({ success: true, data: message });
      } catch (err) {
        console.error("❌ Error sending message via socket", err);
        if(callback) callback({ success: false, error: "Server error" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 User disconnected: ${userId}`);
    });
  });

  return io;
}
