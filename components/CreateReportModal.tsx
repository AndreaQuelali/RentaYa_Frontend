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
import { useCreateReport } from "@/hooks/reports/useReports";
import { Alert } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

interface CreateReportModalProps {
  visible: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  interestId: string;
  onSuccess?: () => void;
}

export default function CreateReportModal({
  visible,
  onClose,
  propertyId,
  propertyTitle,
  interestId,
  onSuccess,
}: CreateReportModalProps) {
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [errors, setErrors] = useState<{
    dates?: string;
    general?: string;
  }>({});
  const { mutate: createReport, isPending } = useCreateReport();
  const queryClient = useQueryClient();

  const handleSubmit = () => {
    if (isPending) return;

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

    // Convertir fechas a formato ISO
    const formatDateToISO = (date: string) => {
      const dateObj = new Date(date.trim() + "T00:00:00");
      return dateObj.toISOString();
    };

    const startDateTime = formatDateToISO(startDate);
    const finishDateTime = formatDateToISO(finishDate);

    setErrors({});

    createReport(
      {
        propertyId,
        interestId,
        startDate: startDateTime,
        finishDate: finishDateTime,
      },
      {
        onSuccess: () => {
          // Invalidar queries para actualizar la lista de intereses
          queryClient.invalidateQueries({
            queryKey: ["interests", "my-interests"],
          });
          queryClient.invalidateQueries({ queryKey: ["interests", "owner"] });
          queryClient.invalidateQueries({ queryKey: ["reports"] });

          Alert.alert(
            "Éxito",
            "Tu solicitud ha sido completada exitosamente. El propietario recibirá una notificación y podrá aceptar o rechazar tu interés. Te notificaremos cuando responda."
          );
          setStartDate("");
          setFinishDate("");
          setErrors({});
          onSuccess?.();
          onClose();
        },
        onError: (error: any) => {
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
  };

  const handleClose = () => {
    if (!isPending) {
      setStartDate("");
      setFinishDate("");
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
        <View className="bg-white rounded-2xl w-full max-w-md p-6">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900">
                Fechas de Alquiler
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
              editable={!isPending}
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
              editable={!isPending}
            />
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

          <View className="flex-row gap-3 mt-4">
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
                  <Ionicons name="checkmark" size={18} color="#fff" />
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
