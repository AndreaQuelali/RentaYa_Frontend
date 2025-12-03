import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DatePickerProps {
  label: string;
  value: string; // formato YYYY-MM-DD
  onChangeDate: (date: string) => void;
  error?: string;
  minDate?: Date; // fecha mínima permitida
  placeholder?: string;
}

export default function DatePicker({
  label,
  value,
  onChangeDate,
  error,
  minDate = new Date(), // por defecto, fecha actual
  placeholder = "Seleccionar fecha"
}: DatePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return placeholder;
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const isDateDisabled = (year: number, month: number, day: number) => {
    const checkDate = new Date(year, month, day);
    // Normalizar fechas a medianoche para comparación justa
    checkDate.setHours(0, 0, 0, 0);
    const min = new Date(minDate);
    min.setHours(0, 0, 0, 0);
    return checkDate < min;
  };

  const handleOpenPicker = () => {
    // Inicializar con la fecha actual o la fecha seleccionada
    if (value) {
      const [year, month, day] = value.split('-').map(Number);
      setSelectedYear(year);
      setSelectedMonth(month - 1);
      setSelectedDay(day);
    } else {
      const today = new Date();
      setSelectedYear(today.getFullYear());
      setSelectedMonth(today.getMonth());
      setSelectedDay(null);
    }
    setShowPicker(true);
  };

  const handleConfirm = () => {
    if (selectedDay === null) return;
    
    const month = String(selectedMonth + 1).padStart(2, '0');
    const day = String(selectedDay).padStart(2, '0');
    const dateString = `${selectedYear}-${month}-${day}`;
    
    onChangeDate(dateString);
    setShowPicker(false);
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const days = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDateDisabled(selectedYear, selectedMonth, day);
      days.push(
        <TouchableOpacity
          key={day}
          onPress={() => !disabled && setSelectedDay(day)}
          disabled={disabled}
          className={`w-10 h-10 items-center justify-center m-1 rounded-lg ${
            selectedDay === day 
              ? 'bg-black' 
              : disabled 
                ? 'bg-gray-100' 
                : 'bg-gray-50'
          }`}
        >
          <Text className={`${
            selectedDay === day 
              ? 'text-white font-bold' 
              : disabled 
                ? 'text-gray-300' 
                : 'text-gray-900'
          }`}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }
    return days;
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
    setSelectedDay(null);
  };

  return (
    <View>
      <Text className="text-sm text-gray-600 mb-1 font-medium">{label}</Text>
      <TouchableOpacity
        onPress={handleOpenPicker}
        style={{
          borderWidth: 1,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderColor: error ? '#f87171' : '#d1d5db',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#fff'
        }}
      >
        <Text style={{ color: value ? '#111827' : '#9ca3af' }}>
          {formatDate(value)}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#6B7280" />
      </TouchableOpacity>
      {error && <Text className="text-red-600 text-xs mt-1">{error}</Text>}

      <Modal
        visible={showPicker}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPicker(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl pb-8">
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
              <Text className="text-lg font-semibold">Seleccionar fecha</Text>
              <TouchableOpacity onPress={() => setShowPicker(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View className="px-4 py-4">
              {/* Controles de mes y año */}
              <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity onPress={handlePrevMonth} className="p-2">
                  <Ionicons name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text className="text-lg font-semibold">
                  {months[selectedMonth]} {selectedYear}
                </Text>
                <TouchableOpacity onPress={handleNextMonth} className="p-2">
                  <Ionicons name="chevron-forward" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              {/* Días de la semana */}
              <View className="flex-row flex-wrap justify-center mb-2">
                {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, i) => (
                  <View key={i} className="w-10 h-8 items-center justify-center m-1">
                    <Text className="text-gray-500 font-medium text-xs">{day}</Text>
                  </View>
                ))}
              </View>

              {/* Días del mes */}
              <View className="flex-row flex-wrap justify-center">
                {/* Espacios vacíos al inicio del mes */}
                {Array.from({ length: new Date(selectedYear, selectedMonth, 1).getDay() }).map((_, i) => (
                  <View key={`empty-${i}`} className="w-10 h-10 m-1" />
                ))}
                {renderDays()}
              </View>
            </View>

            <View className="px-4 mt-4">
              <Pressable
                className={`rounded-xl py-4 items-center ${
                  selectedDay === null ? 'bg-gray-300' : 'bg-black'
                }`}
                onPress={handleConfirm}
                disabled={selectedDay === null}
              >
                <Text className={`font-semibold text-base ${
                  selectedDay === null ? 'text-gray-500' : 'text-white'
                }`}>
                  Confirmar
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
