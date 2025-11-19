import React, { useState } from "react";
import { Modal, View, Text, TextInput, Pressable, TouchableOpacity, ScrollView } from "react-native";
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
    totalPrice: number;
  }) => Promise<void>;
};

const modalidadOptions = [
  { label: 'Alquiler', value: 'alquiler' },
  { label: 'Anticrético', value: 'anticrético' },
];

export default function AssignUserModal({ visible, onClose, propertyId, onAssigned, onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [modalidad, setModalidad] = useState('alquiler');
  const [startDate, setStartDate] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; modalidad?: string; dates?: string; price?: string }>({});

  const reset = () => {
    setEmail("");
    setModalidad('alquiler');
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
    
    // Validar que la fecha de fin sea posterior a la de inicio
    if (startDate && finishDate && /^\d{4}-\d{2}-\d{2}$/.test(startDate) && /^\d{4}-\d{2}-\d{2}$/.test(finishDate)) {
      const start = new Date(startDate);
      const finish = new Date(finishDate);
      if (finish <= start) {
        newErrors.dates = "La fecha de fin debe ser posterior a la fecha de inicio";
      }
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
      
      // Convertir fechas a formato ISO (añadir hora por defecto a medianoche)
      const formatDateToISO = (date: string) => {
        const dateObj = new Date(date + 'T00:00:00');
        return dateObj.toISOString();
      };
      
      const startDateTime = formatDateToISO(startDate);
      const finishDateTime = formatDateToISO(finishDate);
      
      await onSubmit({
        email: email.trim(),
        propertyId,
        type: modalidad,
        startDate: startDateTime,
        finishDate: finishDateTime,
        totalPrice: Number(price),
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
        <View className="w-full bg-white rounded-t-2xl" style={{ maxHeight: '90%' }}>
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-lg font-semibold">Asignar inquilino</Text>
            <TouchableOpacity onPress={onClose} disabled={submitting}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{ padding: 16 }}
            style={{ maxHeight: 400 }}
          >
            <View style={{ gap: 16 }}>
            <View>
              <Text className="text-sm text-gray-600 mb-1 font-medium">Email *</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="correo@ejemplo.com"
                style={{
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderColor: errors.email ? '#f87171' : '#d1d5db',
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {errors.email && <Text className="text-red-600 text-xs mt-1">{errors.email}</Text>}
            </View>

            <View>
              <Text className="text-sm text-gray-600 mb-1 font-medium">Modalidad *</Text>
              <TouchableOpacity
                onPress={() => setShowDropdown(!showDropdown)}
                style={{
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderColor: errors.modalidad ? '#f87171' : '#d1d5db',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ color: selectedModalidad ? '#111827' : '#9ca3af' }}>
                  {selectedModalidad?.label || 'Seleccionar modalidad'}
                </Text>
                <Ionicons name="chevron-down" size={16} color="#6B7280" />
              </TouchableOpacity>
              
              {showDropdown && (
                <View className="mt-1 bg-white border border-gray-200 rounded-xl shadow-lg">
                  {modalidadOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => {
                        setModalidad(option.value);
                        setShowDropdown(false);
                      }}
                      className="px-3 py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <Text className="text-gray-900">{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              
              {errors.modalidad && <Text className="text-red-600 text-xs mt-1">{errors.modalidad}</Text>}
            </View>

            <View>
              <Text className="text-sm text-gray-600 mb-1 font-medium">Fecha Inicio *</Text>
              <TextInput
                value={startDate}
                onChangeText={setStartDate}
                placeholder="2025-12-31"
                style={{
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderColor: errors.dates ? '#f87171' : '#d1d5db',
                }}
              />
            </View>
            
            <View>
              <Text className="text-sm text-gray-600 mb-1 font-medium">Fecha Fin *</Text>
              <TextInput
                value={finishDate}
                onChangeText={setFinishDate}
                placeholder="2026-12-31"
                style={{
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderColor: errors.dates ? '#f87171' : '#d1d5db',
                }}
              />
            </View>
            {errors.dates && <Text className="text-red-600 text-xs mt-1">{errors.dates}</Text>}

            <View>
              <Text className="text-sm text-gray-600 mb-1 font-medium">Precio (Bs) *</Text>
              <TextInput
                value={price}
                onChangeText={setPrice}
                placeholder="0.00"
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderColor: errors.price ? '#f87171' : '#d1d5db',
                }}
              />
              {errors.price && <Text className="text-red-600 text-xs mt-1">{errors.price}</Text>}
            </View>
            </View>
          </ScrollView>

          <View className="flex-row gap-3 p-4 border-t border-gray-200">
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
