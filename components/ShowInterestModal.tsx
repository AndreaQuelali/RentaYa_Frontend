import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCreateInterest } from "@/hooks/interests/useInterests";

interface ShowInterestModalProps {
  visible: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
}

export default function ShowInterestModal({
  visible,
  onClose,
  propertyId,
  propertyTitle,
}: ShowInterestModalProps) {
  const [message, setMessage] = useState("");
  const { mutate: createInterest, isPending } = useCreateInterest();

  const handleSubmit = () => {
    if (isPending) return;

    createInterest(
      {
        propertyId,
        message: message.trim() || undefined,
      },
      {
        onSuccess: () => {
          setMessage("");
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    if (!isPending) {
      setMessage("");
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 items-center justify-center px-4">
        <View className="bg-white rounded-2xl w-full max-w-md p-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">
                Mostrar Interés
              </Text>
              <Text className="text-sm text-gray-600 mt-1">
                {propertyTitle}
              </Text>
            </View>
            <Pressable
              onPress={handleClose}
              disabled={isPending}
              className="p-2"
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </Pressable>
          </View>

          <View className="mb-6">
            <Text className="text-base font-medium text-gray-700 mb-2">
              Mensaje (opcional)
            </Text>
            <TextInput
              className="border border-gray-300 rounded-xl px-4 py-3 text-base min-h-[100px]"
              placeholder="Ej: Me interesa esta propiedad, ¿podríamos agendar una visita?"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              value={message}
              onChangeText={setMessage}
              maxLength={500}
              editable={!isPending}
            />
            <Text className="text-xs text-gray-500 mt-1 text-right">
              {message.length}/500
            </Text>
          </View>

          <View className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6">
            <View className="flex-row items-start gap-2">
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <Text className="text-sm text-blue-800 flex-1">
                El propietario recibirá una notificación y podrá aceptar o
                rechazar tu interés. Te notificaremos cuando responda.
              </Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <Pressable
              onPress={handleClose}
              disabled={isPending}
              className="flex-1 border border-gray-300 rounded-xl py-3 items-center"
            >
              <Text className="text-gray-700 font-semibold">Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              disabled={isPending}
              className="flex-1 bg-primary rounded-xl py-3 items-center flex-row justify-center gap-2"
            >
              {isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="heart" size={18} color="#fff" />
                  <Text className="text-white font-semibold">Enviar</Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

