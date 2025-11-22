import { api } from "./api";
import { Notification, NotificationFilters, UnreadCountResponse } from "@/types/notification";

export const notificationApi = {
  // Obtener todas las notificaciones con filtros opcionales
  getNotifications: async (filters?: NotificationFilters) => {
    const params = new URLSearchParams();
    
    if (filters?.read !== undefined) {
      params.append("read", filters.read.toString());
    }
    
    if (filters?.type) {
      params.append("type", filters.type);
    }

    const response = await api.get<{ success: boolean; data: Notification[]; message: string }>(
      `/api/notifications?${params.toString()}`
    );
    return response.data.data;
  },

  // Obtener cantidad de notificaciones no leídas
  getUnreadCount: async () => {
    const response = await api.get<{ success: boolean; data: UnreadCountResponse }>(
      "/api/notifications/unread-count"
    );
    return response.data.data.count;
  },

  // Marcar una notificación como leída
  markAsRead: async (notificationId: string) => {
    const response = await api.patch<{ success: boolean; data: Notification; message: string }>(
      `/api/notifications/${notificationId}/read`
    );
    return response.data.data;
  },

  // Marcar todas las notificaciones como leídas
  markAllAsRead: async () => {
    const response = await api.patch<{ success: boolean; data: { count: number }; message: string }>(
      "/api/notifications/mark-all-read"
    );
    return response.data.data;
  },

  // Eliminar una notificación
  deleteNotification: async (notificationId: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(
      `/api/notifications/${notificationId}`
    );
    return response.data;
  },

  // Eliminar todas las notificaciones
  deleteAllNotifications: async () => {
    const response = await api.delete<{ success: boolean; data: { count: number }; message: string }>(
      "/api/notifications"
    );
    return response.data.data;
  },

  // Registrar token de dispositivo para push notifications
  registerDeviceToken: async (token: string, platform: "android" | "ios" | "web") => {
    const response = await api.post<{ success: boolean; message: string }>(
      "/api/notifications/device-token",
      { token, platform }
    );
    return response.data;
  },

  // Eliminar token de dispositivo
  removeDeviceToken: async (token: string) => {
    const response = await api.delete<{ success: boolean; message: string }>(
      "/api/notifications/device-token",
      { data: { token } }
    );
    return response.data;
  },
};
