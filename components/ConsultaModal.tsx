import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ConsultaModalProps {
  visible: boolean;
  onClose: () => void;
  propertyTitle: string;
  ownerName: string;
  onSubmit: (message: string) => void;
}

export default function ConsultaModal({
  visible,
  onClose,
  propertyTitle,
  ownerName,
  onSubmit,
}: ConsultaModalProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim() === "") {
      alert("Por favor escribe un mensaje");
      return;
    }
    onSubmit(message);
    handleClose();
  };

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl" style={{ height: "70%" }}>
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
            <Text className="text-xl font-semibold">Enviar consulta</Text>
            <Pressable onPress={handleClose}>
              <Ionicons name="close" size={24} color="#000" />
            </Pressable>
          </View>

          <ScrollView
            className="flex-1 px-4 py-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Información del propietario */}
            <View className="flex-row items-center gap-3 mb-6">
              <View className="w-12 h-12 rounded-full bg-primary items-center justify-center">
                <Ionicons name="person" size={24} color="#fff" />
              </View>
              <View>
                <Text className="text-base font-bold">{ownerName}</Text>
                <Text className="text-sm text-gray-500">Propietario</Text>
              </View>
            </View>

            {/* Título de la propiedad */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-600 mb-1">
                Propiedad
              </Text>
              <Text className="text-base font-semibold text-gray-900">
                {propertyTitle}
              </Text>
            </View>

            {/* Campo de mensaje */}
            <View className="mb-4">
              <Text className="text-base font-bold mb-2">Mensaje</Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 bg-white min-h-40"
                placeholder="Escribe tu mensaje aquí"
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                value={message}
                onChangeText={setMessage}
                maxLength={500}
              />
              <Text className="text-xs text-gray-500 mt-1">
                Puedes hacer preguntas sobre la propiedad
              </Text>
              <Text className="text-xs text-gray-500 mt-1 text-right">
                {message.length}/500
              </Text>
            </View>
          </ScrollView>

          <View className="px-4 py-4 border-t border-gray-200 gap-2">
            <Pressable
              className="bg-black rounded-xl py-4 items-center"
              onPress={handleSubmit}
            >
              <Text className="text-white font-semibold text-base">
                Enviar consulta
              </Text>
            </Pressable>
            <Pressable
              className="bg-gray-100 rounded-xl py-4 items-center"
              onPress={handleClose}
            >
              <Text className="text-gray-700 font-semibold text-base">
                Cancelar
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
