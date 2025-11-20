import { useState, useEffect, useCallback } from "react";
import { notificationApi } from "@/lib/notificationApi";
import { Notification, NotificationFilters } from "@/types/notification";
import { Alert } from "react-native";
import { useNotificationContext } from "@/context/NotificationContext";

export const useNotifications = (filters?: NotificationFilters) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { unreadCount, refreshUnreadCount, decrementUnreadCount, resetUnreadCount } = useNotificationContext();

  // Obtener notificaciones
  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationApi.getNotifications(filters);
      setNotifications(data);
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      Alert.alert("Error", "No se pudieron cargar las notificaciones");
    }
  }, [filters]);

  // Obtener contador de no leídas
  const fetchUnreadCount = useCallback(async () => {
    try {
      await refreshUnreadCount();
    } catch (error: any) {
      console.error("Error fetching unread count:", error);
    }
  }, [refreshUnreadCount]);

  // Cargar datos iniciales
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchNotifications(), fetchUnreadCount()]);
    } finally {
      setLoading(false);
    }
  }, [fetchNotifications, fetchUnreadCount]);

  // Refrescar datos
  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchNotifications(), fetchUnreadCount()]);
    } finally {
      setRefreshing(false);
    }
  }, [fetchNotifications, fetchUnreadCount]);

  // Marcar como leída
  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await notificationApi.markAsRead(notificationId);
        
        // Actualizar estado local
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
        
        // Actualizar contador
        decrementUnreadCount();
      } catch (error: any) {
        console.error("Error marking as read:", error);
        Alert.alert("Error", "No se pudo marcar como leída");
      }
    },
    [decrementUnreadCount]
  );

  // Marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationApi.markAllAsRead();
      
      // Actualizar estado local
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      
      resetUnreadCount();
    } catch (error: any) {
      console.error("Error marking all as read:", error);
      Alert.alert("Error", "No se pudieron marcar todas como leídas");
    }
  }, [resetUnreadCount]);

  // Eliminar notificación
  const deleteNotification = useCallback(
    async (notificationId: string) => {
      try {
        await notificationApi.deleteNotification(notificationId);
        
        // Actualizar estado local
        const notification = notifications.find((n) => n.id === notificationId);
        
        setNotifications((prev) =>
          prev.filter((notif) => notif.id !== notificationId)
        );
        
        // Si no estaba leída, actualizar contador
        if (notification && !notification.read) {
          decrementUnreadCount();
        }
      } catch (error: any) {
        console.error("Error deleting notification:", error);
        Alert.alert("Error", "No se pudo eliminar la notificación");
      }
    },
    [notifications, decrementUnreadCount]
  );

  // Eliminar todas las notificaciones
  const deleteAllNotifications = useCallback(async () => {
    try {
      await notificationApi.deleteAllNotifications();
      
      setNotifications([]);
      resetUnreadCount();
    } catch (error: any) {
      console.error("Error deleting all notifications:", error);
      Alert.alert("Error", "No se pudieron eliminar las notificaciones");
    }
  }, [resetUnreadCount]);

  // Cargar datos al montar
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    notifications,
    unreadCount,
    loading,
    refreshing,
    refresh,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  };
};
