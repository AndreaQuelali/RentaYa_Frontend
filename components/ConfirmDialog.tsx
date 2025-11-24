import React from "react";
import { View, Text, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmColor?: string;
}

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
  confirmColor = "#EF4444",
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-4">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <View className="items-center mb-4">
            <View
              className="w-16 h-16 rounded-full items-center justify-center mb-3"
              style={{ backgroundColor: `${confirmColor}20` }}
            >
              <Ionicons name="alert-circle" size={32} color={confirmColor} />
            </View>
            <Text className="text-xl font-semibold text-gray-900 text-center">
              {title}
            </Text>
          </View>

          <Text className="text-gray-600 text-center mb-6">{message}</Text>

          <View className="flex-row gap-3">
            <Pressable
              onPress={onCancel}
              className="flex-1 bg-gray-100 rounded-xl py-3 items-center"
            >
              <Text className="text-gray-700 font-semibold">{cancelText}</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              className="flex-1 rounded-xl py-3 items-center"
              style={{ backgroundColor: confirmColor }}
            >
              <Text className="text-white font-semibold">{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
