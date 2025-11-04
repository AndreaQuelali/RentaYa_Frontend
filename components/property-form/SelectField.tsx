import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
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
    <View style={{ zIndex: isOpen ? 1000 : 1 }}>
      <Text className="text-sm font-medium mb-1 text-gray-900">{label}</Text>
      <Pressable
        className={`border rounded-xl px-4 py-3 flex-row items-center justify-between bg-white ${
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
        <View style={[styles.dropdownContainer, { elevation: 10 }]}>
          <ScrollView
            style={styles.scrollView}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            bounces={false}
          >
            {options.map((opt, index) => (
              <Pressable
                key={opt}
                className="px-4 py-3 bg-white active:bg-gray-100"
                style={index < options.length - 1 && styles.optionBorder}
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

      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 8,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    zIndex: 1000,
  },
  scrollView: {
    maxHeight: 240,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
});
