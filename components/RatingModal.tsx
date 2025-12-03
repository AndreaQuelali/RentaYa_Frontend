import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  propertyTitle: string;
  onSubmit: (rating: number, comment: string) => void;
  isSubmitting?: boolean;
}

export default function RatingModal({
  visible,
  onClose,
  propertyTitle,
  onSubmit,
  isSubmitting = false,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Por favor selecciona una calificación");
      return;
    }
    onSubmit(rating, comment);
    handleClose();
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
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
        <View className="bg-white rounded-t-3xl" style={{ height: "75%" }}>
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
            <Text className="text-xl font-semibold">
              Calificar esta propiedad
            </Text>
            <Pressable onPress={handleClose}>
              <Ionicons name="close" size={24} color="#000" />
            </Pressable>
          </View>

          <ScrollView
            className="flex-1 px-4 py-6"
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-base text-gray-700 mb-4">
              {propertyTitle}
            </Text>

            {/* Estrellas */}
            <View className="items-center mb-6">
              <Text className="text-base font-semibold mb-3">
                ¿Cómo calificarías esta propiedad?
              </Text>
              <View className="flex-row gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Pressable
                    key={star}
                    onPress={() => setRating(star)}
                    className="p-2"
                  >
                    <Ionicons
                      name={star <= rating ? "star" : "star-outline"}
                      size={40}
                      color={star <= rating ? "#FFA500" : "#D1D5DB"}
                    />
                  </Pressable>
                ))}
              </View>
              {rating > 0 && (
                <Text className="text-sm text-gray-600 mt-2">
                  {rating === 1 && "Muy mala"}
                  {rating === 2 && "Mala"}
                  {rating === 3 && "Regular"}
                  {rating === 4 && "Buena"}
                  {rating === 5 && "Excelente"}
                </Text>
              )}
            </View>

            {/* Comentario */}
            <View className="mb-4">
              <Text className="text-base font-semibold mb-2">
                Comentario (opcional)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 bg-white min-h-32"
                placeholder="Comparte tu experiencia con esta propiedad..."
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={comment}
                onChangeText={setComment}
                maxLength={500}
              />
              <Text className="text-xs text-gray-500 mt-1 text-right">
                {comment.length}/500
              </Text>
            </View>
          </ScrollView>

          <View className="px-4 py-4 border-t border-gray-200 gap-2">
            <Pressable
              className={`rounded-xl py-4 items-center ${isSubmitting ? 'bg-black/70' : 'bg-black'}`}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Calificar
                </Text>
              )}
            </Pressable>
            <Pressable
              className="bg-gray-100 rounded-xl py-4 items-center"
              onPress={handleClose}
              disabled={isSubmitting}
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
