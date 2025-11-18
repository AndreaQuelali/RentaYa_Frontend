import React, { useState } from "react";
import { Modal, View, Text, TextInput, Pressable, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  onClose: () => void;
  propertyId: string | null;
  onAssigned?: () => void;
  onSubmit: (payload: {
    email: string;
    propertyId: string;
    type: string;
    startDate: string;
    finishDate: string;
    price: number;
  }) => Promise<void>;
};

const modalidadOptions = [
  { label: 'Alquiler', value: 'RENT' },
  { label: 'Anticrético', value: 'ANTICRETIC' },
];

export default function AssignUserModal({ visible, onClose, propertyId, onAssigned, onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [modalidad, setModalidad] = useState('RENT');
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; modalidad?: string; dates?: string; price?: string }>({});

  const reset = () => {
    setEmail("");
    setModalidad('RENT');
    setStartDate("");
    setFinishDate("");
    setPrice("");
    setShowDropdown(false);
    setErrors({});
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (!propertyId) return;
    
    const newErrors: { email?: string; modalidad?: string; dates?: string; price?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!validateEmail(email)) {
      newErrors.email = "Email inválido";
    }
    
    if (!modalidad) {
      newErrors.modalidad = "La modalidad es requerida";
    }
    
    if (!startDate) {
      newErrors.dates = "La fecha de inicio es requerida";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
      newErrors.dates = "Fecha de inicio inválida (YYYY-MM-DD)";
    }
    
    if (!finishDate) {
      newErrors.dates = newErrors.dates ? newErrors.dates + "; fin requerida" : "La fecha de fin es requerida";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(finishDate)) {
      newErrors.dates = newErrors.dates ? newErrors.dates + "; fin inválida" : "Fecha de fin inválida (YYYY-MM-DD)";
    }
    
    if (!price.trim()) {
      newErrors.price = "El precio es requerido";
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Precio debe ser un número mayor a 0";
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    try {
      setSubmitting(true);
      await onSubmit({
        email: email.trim(),
        propertyId,
        type: modalidad,
        startDate,
        finishDate,
        price: Number(price),
      });
      onAssigned?.();
      reset();
      onClose();
    } catch (e) {
      console.error('Error al asignar:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedModalidad = modalidadOptions.find(option => option.value === modalidad);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/40 items-center justify-end">
        <View className="w-full bg-white rounded-t-2xl p-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold">Asignar inquilino</Text>
            <TouchableOpacity onPress={onClose} disabled={submitting}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View className="gap-4">
            <View>
              <Text className="text-sm text-gray-600 mb-1 font-medium">Email *</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="correo@ejemplo.com"
                className={`border rounded-xl px-3 py-2 ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {errors.email && <Text className="text-red-600 text-xs mt-1">{errors.email}</Text>}
            </View>

            <View>
              <Text className="text-sm text-gray-600 mb-1 font-medium">Modalidad *</Text>
              <TouchableOpacity
                onPress={() => setShowDropdown(!showDropdown)}
                className={`border rounded-xl px-3 py-2 flex-row items-center justify-between ${errors.modalidad ? 'border-red-400' : 'border-gray-300'}`}
              >
                <Text className={selectedModalidad ? 'text-gray-900' : 'text-gray-400'}>
                  {selectedModalidad?.label || 'Seleccionar modalidad'}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#6B7280" />
              </TouchableOpacity>
              
              {showDropdown && (
                <View className="absolute top-20 left-4 right-4 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                  {modalidadOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => {
                        setModalidad(option.value);
                        setShowDropdown(false);
                      }}
                      className="px-3 py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <Text className="text-gray-900">{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              
              {errors.modalidad && <Text className="text-red-600 text-xs mt-1">{errors.modalidad}</Text>}
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <Text className="text-sm text-gray-600 mb-1 font-medium">Fecha Inicio *</Text>
                <TextInput
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="2025-12-31"
                  className={`border rounded-xl px-3 py-2 ${errors.dates ? 'border-red-400' : 'border-gray-300'}`}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-600 mb-1 font-medium">Fecha Fin *</Text>
                <TextInput
                  value={finishDate}
                  onChangeText={setFinishDate}
                  placeholder="2026-12-31"
                  className={`border rounded-xl px-3 py-2 ${errors.dates ? 'border-red-400' : 'border-gray-300'}`}
                />
              </View>
            </View>
            {errors.dates && <Text className="text-red-600 text-xs mt-1">{errors.dates}</Text>}

            <View>
              <Text className="text-sm text-gray-600 mb-1 font-medium">Precio (Bs) *</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                keyboardType="numeric"
                className={`border rounded-xl px-3 py-2 ${errors.price ? 'border-red-400' : 'border-gray-300'}`}
              />
              {errors.price && <Text className="text-red-600 text-xs mt-1">{errors.price}</Text>}
            </View>
          </View>

          <View className="flex-row gap-3 mt-6">
            <Pressable 
              className="flex-1 bg-gray-100 rounded-xl py-3 items-center" 
              onPress={onClose} 
              disabled={submitting}
            >
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
