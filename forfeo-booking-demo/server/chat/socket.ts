import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import * as db from "../db";

let io: SocketIOServer | null = null;

export function initializeSocketIO(httpServer: HTTPServer) {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === "development" 
        ? "http://localhost:3000" 
        : true,
      credentials: true,
    },
    path: "/socket.io/",
  });

  io.on("connection", (socket: Socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Join a booking room
    socket.on("join:booking", (bookingId: number) => {
      const room = `booking:${bookingId}`;
      socket.join(room);
      console.log(`[Socket.io] Socket ${socket.id} joined room ${room}`);
      
      // Send existing messages
      db.getChatMessagesByBooking(bookingId).then(messages => {
        socket.emit("messages:history", messages);
      });
    });

    // Leave a booking room
    socket.on("leave:booking", (bookingId: number) => {
      const room = `booking:${bookingId}`;
      socket.leave(room);
      console.log(`[Socket.io] Socket ${socket.id} left room ${room}`);
    });

    // Send a message
    socket.on("message:send", async (data: {
      bookingId: number;
      senderId: number;
      senderType: "customer" | "company" | "bot";
      message: string;
    }) => {
      try {
        // Save message to database
        const messageId = await db.createChatMessage({
          bookingId: data.bookingId,
          senderId: data.senderId,
          senderType: data.senderType,
          message: data.message,
        });

        // Get the full message
        const messages = await db.getChatMessagesByBooking(data.bookingId);
        const newMessage = messages.find(m => m.id === messageId);

        if (newMessage) {
          // Broadcast to all clients in the booking room
          const room = `booking:${data.bookingId}`;
          io?.to(room).emit("message:new", newMessage);
          
          console.log(`[Socket.io] Message sent to room ${room}`);
        }

        // TODO: Send email notification if recipient is offline
      } catch (error) {
        console.error("[Socket.io] Error sending message:", error);
        socket.emit("message:error", { error: "Failed to send message" });
      }
    });

    // Mark messages as read
    socket.on("messages:markRead", async (bookingId: number) => {
      try {
        await db.markMessagesAsRead(bookingId);
        const room = `booking:${bookingId}`;
        io?.to(room).emit("messages:read", { bookingId });
      } catch (error) {
        console.error("[Socket.io] Error marking messages as read:", error);
      }
    });

    // Typing indicator
    socket.on("typing:start", (data: { bookingId: number; senderType: string }) => {
      const room = `booking:${data.bookingId}`;
      socket.to(room).emit("typing:start", data);
    });

    socket.on("typing:stop", (data: { bookingId: number; senderType: string }) => {
      const room = `booking:${data.bookingId}`;
      socket.to(room).emit("typing:stop", data);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  console.log("[Socket.io] Server initialized");
  return io;
}

export function getIO(): SocketIOServer | null {
  return io;
}

// Helper function to send notification to a specific booking room
export function notifyBookingRoom(bookingId: number, event: string, data: any) {
  if (!io) {
    console.warn("[Socket.io] Server not initialized");
    return;
  }
  
  const room = `booking:${bookingId}`;
  io.to(room).emit(event, data);
  console.log(`[Socket.io] Notification sent to room ${room}: ${event}`);
}
