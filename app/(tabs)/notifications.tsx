import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import Logo from "@/assets/logo";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationItem } from "@/components/NotificationItem";
import { NotificationType } from "@/types/notification";
import { useNotificationContext } from "@/context/NotificationContext";

type FilterType = "all" | "unread" | NotificationType;

export default function NotificationsScreen() {
  const [filter, setFilter] = useState<FilterType>("all");
  const { refreshUnreadCount } = useNotificationContext();
  
  const filterConfig = filter === "all" 
    ? undefined 
    : filter === "unread" 
    ? { read: false }
    : { type: filter as NotificationType };

  const {
    notifications,
    unreadCount,
    loading,
    refreshing,
    refresh,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotifications(filterConfig);

  // Actualizar contador cuando se enfoca la pantalla
  useFocusEffect(
    React.useCallback(() => {
      refreshUnreadCount();
    }, [refreshUnreadCount])
  );

  const handleMarkAllAsRead = () => {
    if (unreadCount === 0) {
      Alert.alert("Info", "No hay notificaciones sin leer");
      return;
    }

    Alert.alert(
      "Marcar todas como leídas",
      "¿Deseas marcar todas las notificaciones como leídas?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Marcar todas",
          onPress: markAllAsRead,
        },
      ]
    );
  };

  const handleDeleteAll = () => {
    if (notifications.length === 0) {
      Alert.alert("Info", "No hay notificaciones para eliminar");
      return;
    }

    Alert.alert(
      "Eliminar todas",
      "¿Estás seguro de que deseas eliminar todas las notificaciones?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar todas",
          style: "destructive",
          onPress: deleteAllNotifications,
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white">
        <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-2">
          <Logo size={20} />
          <Text className="text-white font-semibold text-lg">RentaYa</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#D65E48" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-primary pt-12 pb-3 px-4 flex-row items-center gap-2">
        <Logo size={20} />
        <Text className="text-white font-semibold text-lg">RentaYa</Text>
      </View>

      <View className="flex-row items-center justify-between px-4 py-3">
        <Text className="text-2xl font-bold text-gray-900 mb-2">Notificaciones</Text>
        {unreadCount > 0 && (
          <View className="bg-white px-2 py-1 rounded-full">
              <Text className="text-primary font-semibold text-sm">
                {unreadCount} nueva{unreadCount !== 1 ? "s" : ""}
              </Text>
            </View>
          )}
        </View>
      

      {/* Actions */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <Pressable
          onPress={handleMarkAllAsRead}
          className="flex-row items-center gap-1"
          disabled={unreadCount === 0}
        >
          <Ionicons
            name="checkmark-done"
            size={18}
            color={unreadCount > 0 ? "#10B981" : "#D1D5DB"}
          />
          <Text
            className={`text-sm ${
              unreadCount > 0 ? "text-green-600" : "text-gray-400"
            }`}
          >
            Marcar todas
          </Text>
        </Pressable>

        <Pressable
          onPress={handleDeleteAll}
          className="flex-row items-center gap-1"
          disabled={notifications.length === 0}
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={notifications.length > 0 ? "#EF4444" : "#D1D5DB"}
          />
          <Text
            className={`text-sm ${
              notifications.length > 0 ? "text-red-600" : "text-gray-400"
            }`}
          >
            Eliminar todas
          </Text>
        </Pressable>
      </View>

      {/* Filter Tabs */}
      <View className="flex-row px-4 py-3 gap-2 border-b border-gray-200">
        <Pressable
          onPress={() => setFilter("all")}
          className={`px-4 py-2 rounded-full ${
            filter === "all" ? "bg-primary" : "bg-gray-100"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              filter === "all" ? "text-white" : "text-gray-700"
            }`}
          >
            Todas
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setFilter("unread")}
          className={`px-4 py-2 rounded-full ${
            filter === "unread" ? "bg-primary" : "bg-gray-100"
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              filter === "unread" ? "text-white" : "text-gray-700"
            }`}
          >
            No leídas
          </Text>
        </Pressable>
      </View>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="notifications-off-outline" size={64} color="#D1D5DB" />
          <Text className="text-gray-400 text-lg font-semibold mt-4 text-center">
            No hay notificaciones
          </Text>
          <Text className="text-gray-400 text-sm mt-2 text-center">
            {filter === "unread"
              ? "No tienes notificaciones sin leer"
              : "Cuando recibas notificaciones, aparecerán aquí"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onMarkAsRead={markAsRead}
              onDelete={deleteNotification}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              colors={["#D65E48"]}
              tintColor="#D65E48"
            />
          }
          ItemSeparatorComponent={() => <View className="h-px bg-gray-100" />}
        />
      )}
    </View>
  );
}
