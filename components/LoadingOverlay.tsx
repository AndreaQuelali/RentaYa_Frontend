import React from "react";
import { View, Text, ActivityIndicator, Modal } from "react-native";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export default function LoadingOverlay({
  visible,
  message = "Cargando...",
}: LoadingOverlayProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/50 items-center justify-center">
        <View className="bg-white rounded-2xl p-6 items-center min-w-[200px]">
          <ActivityIndicator size="large" color="#D65E48" />
          {message && (
            <Text className="text-gray-700 mt-4 text-base font-medium text-center">
              {message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}
