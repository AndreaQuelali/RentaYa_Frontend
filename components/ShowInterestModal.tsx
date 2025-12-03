import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCreateInterest } from "@/hooks/interests/useInterests";
import { useCreateReport } from "@/hooks/reports/useReports";

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
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{
    dates?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: createInterest } = useCreateInterest();
  const { mutate: createReport } = useCreateReport();

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const newErrors: { dates?: string } = {};

    // Validar fechas
    if (!startDate || !startDate.trim()) {
      newErrors.dates = "La fecha de inicio es requerida";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate.trim())) {
      newErrors.dates = "Fecha de inicio inválida (YYYY-MM-DD)";
    }

    if (!finishDate || !finishDate.trim()) {
      newErrors.dates = newErrors.dates
        ? newErrors.dates + "; La fecha de fin es requerida"
        : "La fecha de fin es requerida";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(finishDate.trim())) {
      newErrors.dates = newErrors.dates
        ? newErrors.dates + "; Fecha de fin inválida"
        : "Fecha de fin inválida (YYYY-MM-DD)";
    }

    // Validar que la fecha de fin sea posterior a la de inicio
    if (
      startDate &&
      finishDate &&
      /^\d{4}-\d{2}-\d{2}$/.test(startDate.trim()) &&
      /^\d{4}-\d{2}-\d{2}$/.test(finishDate.trim())
    ) {
      const start = new Date(startDate.trim());
      const finish = new Date(finishDate.trim());
      if (finish <= start) {
        newErrors.dates =
          "La fecha de fin debe ser posterior a la fecha de inicio";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Convertir fechas a formato ISO
      const formatDateToISO = (date: string) => {
        const dateObj = new Date(date.trim() + "T00:00:00");
        return dateObj.toISOString();
      };

      const startDateTime = formatDateToISO(startDate);
      const finishDateTime = formatDateToISO(finishDate);

      // Paso 1: Crear el interés (solo con mensaje)
      createInterest(
        {
          propertyId,
          message: message.trim() || undefined,
        },
        {
          onSuccess: async (interest: any) => {
            const interestId = interest?.id || interest?.data?.id;

            if (!interestId) {
              setIsSubmitting(false);
              setErrors({
                general: "No se pudo obtener el ID del interés creado",
              });
              return;
            }

            // Paso 2: Crear el reporte con el interestId generado
            createReport(
              {
                propertyId,
                interestId,
                startDate: startDateTime,
                finishDate: finishDateTime,
              },
              {
                onSuccess: () => {
                  setIsSubmitting(false);
                  setStartDate("");
                  setFinishDate("");
                  setMessage("");
                  setErrors({});
                  Alert.alert(
                    "Éxito",
                    "Tu interés ha sido enviado al propietario. Te notificaremos cuando responda."
                  );
                  onClose();
                },
                onError: (error: any) => {
                  setIsSubmitting(false);
                  const errorMessage =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Error al crear el reporte. Por favor, intenta de nuevo.";
                  setErrors({
                    general: errorMessage,
                  });
                },
              }
            );
          },
          onError: (error: any) => {
            setIsSubmitting(false);
            const errorMessage =
              error?.response?.data?.message ||
              error?.message ||
              "Error al crear el interés. Por favor, intenta de nuevo.";
            setErrors({
              general: errorMessage,
            });
          },
        }
      );
    } catch {
      setIsSubmitting(false);
      setErrors({
        general: "Error inesperado. Por favor, intenta de nuevo.",
      });
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setStartDate("");
      setFinishDate("");
      setMessage("");
      setErrors({});
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
        <View className="bg-white rounded-2xl w-full max-w-md max-h-[90%] p-6">
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
              disabled={isSubmitting}
              className="p-2"
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </Pressable>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="mb-4">
              <Text className="text-base font-medium text-gray-700 mb-2">
                Fecha de inicio <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholder="YYYY-MM-DD (ej: 2025-11-01)"
                placeholderTextColor="#9CA3AF"
                value={startDate}
                onChangeText={setStartDate}
                editable={!isSubmitting}
              />
            </View>

            <View className="mb-4">
              <Text className="text-base font-medium text-gray-700 mb-2">
                Fecha de fin <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 text-base"
                placeholder="YYYY-MM-DD (ej: 2025-11-30)"
                placeholderTextColor="#9CA3AF"
                value={finishDate}
                onChangeText={setFinishDate}
                editable={!isSubmitting}
              />
            </View>

            <View className="mb-4">
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
                editable={!isSubmitting}
              />
              <Text className="text-xs text-gray-500 mt-1 text-right">
                {message.length}/500
              </Text>
            </View>

            {errors.dates && (
              <View className="mb-4">
                <Text className="text-red-500 text-sm">{errors.dates}</Text>
              </View>
            )}

            {errors.general && (
              <View className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3">
                <Text className="text-red-600 text-sm font-medium">
                  {errors.general}
                </Text>
              </View>
            )}

            <View className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6">
              <View className="flex-row items-start gap-2">
                <Ionicons name="information-circle" size={20} color="#3B82F6" />
                <Text className="text-sm text-blue-800 flex-1">
                  El propietario recibirá una notificación y podrá aceptar o
                  rechazar tu interés. Te notificaremos cuando responda.
                </Text>
              </View>
            </View>
          </ScrollView>

          <View className="flex-row gap-3">
            <Pressable
              onPress={handleClose}
              disabled={isSubmitting}
              className="flex-1 border border-gray-300 rounded-xl py-3 items-center"
            >
              <Text className="text-gray-700 font-semibold">Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-primary rounded-xl py-3 items-center flex-row justify-center gap-2"
            >
              {isSubmitting ? (
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
