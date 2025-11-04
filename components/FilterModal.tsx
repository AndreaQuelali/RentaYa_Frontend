import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PROVINCIAS } from "@/constants/provinces";
import { PROPERTY_TYPES, OPERATION_MODES } from "@/constants/propertyOptions";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
}

export interface FilterValues {
  provincia?: string;
  tipoPropiedad?: string;
  modalidad?: string;
  precio?: string;
}

export default function FilterModal({
  visible,
  onClose,
  onApplyFilters,
  initialFilters,
}: FilterModalProps) {
  const [provincia, setProvincia] = useState(initialFilters?.provincia || "");
  const [tipoPropiedad, setTipoPropiedad] = useState(
    initialFilters?.tipoPropiedad || ""
  );
  const [modalidad, setModalidad] = useState(initialFilters?.modalidad || "");
  const [precio, setPrecio] = useState(initialFilters?.precio || "");

  const [showProvinciaPicker, setShowProvinciaPicker] = useState(false);
  const [showTipoPicker, setShowTipoPicker] = useState(false);
  const [showModalidadPicker, setShowModalidadPicker] = useState(false);

  const handleApply = () => {
    onApplyFilters({
      provincia,
      tipoPropiedad,
      modalidad,
      precio,
    });
    onClose();
  };

  const handleClear = () => {
    setProvincia("");
    setTipoPropiedad("");
    setModalidad("");
    setPrecio("");
  };

  const renderPicker = (
    label: string,
    value: string,
    options: readonly string[] | string[],
    onSelect: (value: string) => void,
    isOpen: boolean,
    onToggle: () => void
  ) => (
    <View className="mb-4">
      <Text className="text-sm font-medium mb-2 text-gray-900">{label}</Text>
      <Pressable
        className="border border-gray-300 rounded-xl px-4 py-3 flex-row items-center justify-between bg-white"
        onPress={onToggle}
      >
        <View className="flex-row items-center gap-2">
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text className={value ? "text-black" : "text-gray-400"}>
            {value || `Seleccione ${label.toLowerCase()}`}
          </Text>
        </View>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={18}
          color="#6B7280"
        />
      </Pressable>

      {isOpen && (
        <View className="mt-2 border border-gray-200 rounded-xl bg-white max-h-48">
          <ScrollView showsVerticalScrollIndicator={true}>
            <Pressable
              className="px-4 py-3 border-b border-gray-100 active:bg-gray-100"
              onPress={() => {
                onSelect("");
                onToggle();
              }}
            >
              <Text className="text-gray-500">Todos</Text>
            </Pressable>
            {options.map((opt) => (
              <Pressable
                key={opt}
                className="px-4 py-3 border-b border-gray-100 active:bg-gray-100"
                onPress={() => {
                  onSelect(opt);
                  onToggle();
                }}
              >
                <Text className="text-gray-900">{opt}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl" style={{ height: "90%" }}>
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
            <Text className="text-xl font-semibold">Filtros</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </Pressable>
          </View>

          <ScrollView
            className="flex-1 px-4 py-4"
            showsVerticalScrollIndicator={false}
          >
            {renderPicker(
              "Provincia",
              provincia,
              PROVINCIAS,
              setProvincia,
              showProvinciaPicker,
              () => setShowProvinciaPicker(!showProvinciaPicker)
            )}

            {renderPicker(
              "Tipo de propiedad",
              tipoPropiedad,
              PROPERTY_TYPES,
              setTipoPropiedad,
              showTipoPicker,
              () => setShowTipoPicker(!showTipoPicker)
            )}

            <View className="mb-4">
              <Text className="text-sm font-medium mb-2 text-gray-900">
                Precio (Bs)
              </Text>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 bg-white"
                placeholder="3000 Bs"
                keyboardType="numeric"
                value={precio}
                onChangeText={setPrecio}
              />
            </View>

            {renderPicker(
              "Modalidad",
              modalidad,
              OPERATION_MODES,
              setModalidad,
              showModalidadPicker,
              () => setShowModalidadPicker(!showModalidadPicker)
            )}
          </ScrollView>

          <View className="px-4 py-4 border-t border-gray-200 gap-2">
            <Pressable
              className="bg-primary rounded-xl py-4 items-center"
              onPress={handleApply}
            >
              <Text className="text-white font-semibold text-base">
                Aplicar filtros
              </Text>
            </Pressable>
            <Pressable
              className="bg-gray-100 rounded-xl py-4 items-center"
              onPress={handleClear}
            >
              <Text className="text-gray-700 font-semibold text-base">
                Limpiar filtros
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
