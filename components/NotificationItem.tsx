import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Notification, NotificationType } from "@/types/notification";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case NotificationType.NEW_INTEREST:
      return { name: "heart", color: "#D65E48" };
    case NotificationType.INTEREST_ACCEPTED:
      return { name: "checkmark-circle", color: "#10B981" };
    case NotificationType.INTEREST_REJECTED:
      return { name: "close-circle", color: "#EF4444" };
    case NotificationType.NEW_MESSAGE:
      return { name: "chatbubble", color: "#3B82F6" };
    case NotificationType.PROPERTY_APPROVED:
      return { name: "checkmark-done-circle", color: "#10B981" };
    case NotificationType.PROPERTY_REJECTED:
      return { name: "close-circle-outline", color: "#EF4444" };
    case NotificationType.PROPERTY_RENTED:
      return { name: "home", color: "#8B5CF6" };
    case NotificationType.PROPERTY_AVAILABLE:
      return { name: "home-outline", color: "#10B981" };
    case NotificationType.NEW_REVIEW:
      return { name: "star", color: "#F59E0B" };
    case NotificationType.RECOMMENDATION:
      return { name: "bulb", color: "#F59E0B" };
    case NotificationType.PRICE_DROP:
      return { name: "trending-down", color: "#10B981" };
    case NotificationType.NEW_PROPERTY_AREA:
      return { name: "location", color: "#3B82F6" };
    case NotificationType.NEW_PROPERTY:
      return { name: "home", color: "#D65E48" };
    case NotificationType.WELCOME:
      return { name: "hand-left", color: "#D65E48" };
    case NotificationType.ACCOUNT_VERIFIED:
      return { name: "shield-checkmark", color: "#10B981" };
    case NotificationType.SYSTEM:
    default:
      return { name: "information-circle", color: "#6B7280" };
  }
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDelete,
}) => {
  const icon = getNotificationIcon(notification.type);
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: es,
  });

  const handleDelete = () => {
    Alert.alert(
      "Eliminar notificación",
      "¿Estás seguro de que deseas eliminar esta notificación?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => onDelete(notification.id),
        },
      ]
    );
  };

  return (
    <Pressable
      onPress={() => !notification.read && onMarkAsRead(notification.id)}
      className={`p-4 border-b border-gray-200 ${
        !notification.read ? "bg-orange-50" : "bg-white"
      }`}
    >
      <View className="flex-row items-start gap-3">
        {/* Icon */}
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: `${icon.color}20` }}
        >
          <Ionicons
            name={icon.name as any}
            size={20}
            color={icon.color}
          />
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-1">
            <Text
              className={`flex-1 text-base ${
                !notification.read ? "font-semibold" : "font-normal"
              }`}
            >
              {notification.title}
            </Text>
            {!notification.read && (
              <View className="w-2 h-2 rounded-full bg-primary ml-2 mt-1" />
            )}
          </View>

          <Text className="text-gray-600 text-sm mb-2">
            {notification.content}
          </Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-gray-400 text-xs">{timeAgo}</Text>
            
            <View className="flex-row items-center gap-3">
              {!notification.read && (
                <Pressable
                  onPress={() => onMarkAsRead(notification.id)}
                  className="flex-row items-center gap-1"
                >
                  <Ionicons name="checkmark" size={14} color="#10B981" />
                  <Text className="text-xs text-green-600">Marcar leída</Text>
                </Pressable>
              )}
              
              <Pressable
                onPress={handleDelete}
                className="flex-row items-center gap-1"
              >
                <Ionicons name="trash-outline" size={14} color="#EF4444" />
                <Text className="text-xs text-red-600">Eliminar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
