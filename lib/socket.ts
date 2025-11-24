import { io, Socket } from "socket.io-client";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

let socket: Socket | null = null;

export function getSocket(): Socket | null {
  return socket;
}

export async function connectSocket(userId: string): Promise<Socket> {
  // Si ya existe una conexión, desconectarla primero
  if (socket?.connected) {
    socket.disconnect();
  }

  // Crear nueva conexión
  socket = io(API_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    console.log("[Socket] Connected:", socket?.id);

    // Suscribirse al room del usuario
    if (userId && socket) {
      socket.emit("subscribe", { userId });
      console.log("[Socket] Subscribed to room: user:" + userId);
    }
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected:", reason);
  });

  socket.on("connect_error", (error) => {
    console.error("[Socket] Connection error:", error);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log("[Socket] Reconnected after", attemptNumber, "attempts");

    // Re-suscribirse al room del usuario
    if (userId) {
      socket?.emit("subscribe", { userId });
    }
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("[Socket] Disconnected and cleaned up");
  }
}

export function onNotification(callback: (data: any) => void): void {
  if (!socket) {
    console.warn(
      "[Socket] Socket not connected, cannot listen to notifications"
    );
    return;
  }

  socket.on("notification", (data) => {
    console.log("[Socket] Notification received:", data);
    callback(data);
  });
}

export function offNotification(callback?: (data: any) => void): void {
  if (!socket) {
    return;
  }

  if (callback) {
    socket.off("notification", callback);
  } else {
    socket.off("notification");
  }
}
