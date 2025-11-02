import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SelectFieldProps {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  error?: string;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  placeholder,
  options,
  isOpen,
  onToggle,
  onSelect,
  error,
}) => {
  return (
    <View>
      <Text className="text-sm font-medium mb-1 text-gray-900">{label}</Text>
      <Pressable
        className={`border rounded-xl px-4 py-3 flex-row items-center justify-between ${
          error ? "border-red-500" : "border-gray-200"
        }`}
        onPress={onToggle}
      >
        <Text className={value ? "text-black" : "text-gray-400"}>
          {value || placeholder}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={18}
          color="#6B7280"
        />
      </Pressable>

      {isOpen && (
        <View className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
          {options.map((opt) => (
            <Pressable
              key={opt}
              className="px-4 py-3 bg-white active:bg-gray-50"
              onPress={() => {
                onSelect(opt);
                onToggle();
              }}
            >
              <Text className="text-gray-900">{opt}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
};
