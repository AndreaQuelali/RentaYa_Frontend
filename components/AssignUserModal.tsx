import React, { useState } from "react";
import { Modal, View, Text, TextInput, Pressable } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  propertyId: string | null;
  onAssigned?: () => void;
  onSubmit: (payload: {
    usernameOrEmail: string;
    propertyId: string;
    type: string;
    startDate?: Date;
    finishDate?: Date;
    totalPrice?: number;
  }) => Promise<void>;
};

export default function AssignUserModal({ visible, onClose, propertyId, onAssigned, onSubmit }: Props) {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [finishDate, setFinishDate] = useState<Date | undefined>(undefined);
  const [totalPrice, setTotalPrice] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [startDateStr, setStartDateStr] = useState("");
  const [finishDateStr, setFinishDateStr] = useState("");
  const [errors, setErrors] = useState<{ username?: string; dates?: string; price?: string }>({});

  const reset = () => {
    setUsernameOrEmail("");
    setStartDate(undefined);
    setFinishDate(undefined);
    setTotalPrice("");
    setStartDateStr("");
    setFinishDateStr("");
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!propertyId) return;
    const newErrors: { username?: string; dates?: string; price?: string } = {};
    // usernameOrEmail es opcional según requerimiento actual
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (startDateStr && !dateRegex.test(startDateStr)) {
      newErrors.dates = "Fecha de inicio inválida (YYYY-MM-DD)";
    }
    if (finishDateStr && !dateRegex.test(finishDateStr)) {
      newErrors.dates = newErrors.dates ? newErrors.dates + "; fin inválida" : "Fecha de fin inválida (YYYY-MM-DD)";
    }
    if (totalPrice && isNaN(Number(totalPrice))) {
      newErrors.price = "Precio total debe ser numérico";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    try {
      setSubmitting(true);
      // Parse dates from inputs (YYYY-MM-DD)
      const sDate = startDateStr ? new Date(startDateStr) : startDate;
      const fDate = finishDateStr ? new Date(finishDateStr) : finishDate;
      await onSubmit({
        usernameOrEmail,
        propertyId,
        type: 'RENT',
        startDate: sDate,
        finishDate: fDate,
        totalPrice: totalPrice ? Number(totalPrice) : undefined,
      });
      onAssigned?.();
      reset();
      onClose();
    } catch (e) {
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 items-center justify-end">
        <View className="w-full bg-white rounded-t-2xl p-4">
          <Text className="text-lg font-semibold mb-3">Asignar inquilino</Text>

          <View className="gap-3">
            <View>
              <Text className="text-sm text-gray-600 mb-1">Correo o nombre de usuario</Text>
              <TextInput
                value={usernameOrEmail}
                onChangeText={setUsernameOrEmail}
                placeholder="usuario@correo.com"
                className={`border rounded-xl px-3 py-2 ${errors.username ? 'border-red-400' : 'border-gray-300'}`}
                autoCapitalize="none"
              />
              {errors.username && <Text className="text-red-600 text-xs mt-1">{errors.username}</Text>}
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-sm text-gray-600 mb-1">Inicio (YYYY-MM-DD)</Text>
                <TextInput
                  value={startDateStr}
                  onChangeText={setStartDateStr}
                  placeholder="2025-12-31"
                  className={`border rounded-xl px-3 py-2 ${errors.dates ? 'border-red-400' : 'border-gray-300'}`}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-600 mb-1">Fin (YYYY-MM-DD)</Text>
                <TextInput
                  value={finishDateStr}
                  onChangeText={setFinishDateStr}
                  placeholder="2026-12-31"
                  className={`border rounded-xl px-3 py-2 ${errors.dates ? 'border-red-400' : 'border-gray-300'}`}
                />
              </View>
            </View>
            {errors.dates && <Text className="text-red-600 text-xs mt-1">{errors.dates}</Text>}

            <View>
              <Text className="text-sm text-gray-600 mb-1">Precio total (opcional)</Text>
              <TextInput
                value={totalPrice}
                onChangeText={setTotalPrice}
                placeholder="0"
                keyboardType="numeric"
                className={`border rounded-xl px-3 py-2 ${errors.price ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.price && <Text className="text-red-600 text-xs mt-1">{errors.price}</Text>}
            </View>
          </View>

          <View className="flex-row gap-3 mt-5">
            <Pressable className="flex-1 bg-gray-100 rounded-xl py-3 items-center" onPress={onClose} disabled={submitting}>
              <Text className="text-gray-700 font-semibold">Cancelar</Text>
            </Pressable>
            <Pressable
              className={`flex-1 rounded-xl py-3 items-center ${submitting ? "bg-black/70" : "bg-black"}`}
              onPress={handleSubmit}
              disabled={submitting || !propertyId}
            >
              <Text className="text-white font-semibold">{submitting ? 'Asignando...' : 'Asignar'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
