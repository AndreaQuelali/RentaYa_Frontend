import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FormFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChangeText,
  icon,
  error,
  placeholder,
  ...rest
}) => {
  return (
    <View>
      <Text className="text-sm font-medium mb-1 text-gray-900">{label}</Text>
      <View
        className={`border rounded-xl px-3 py-3 flex-row items-center gap-2 ${
          error ? "border-red-500" : "border-gray-200"
        }`}
      >
        {icon && <Ionicons name={icon} size={16} color="#6B7280" />}
        <TextInput
          className="flex-1 text-gray-900"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          {...rest}
        />
      </View>
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
};
