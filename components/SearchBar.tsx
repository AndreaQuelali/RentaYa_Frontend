import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress?: () => void;
  placeholder?: string;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  onFilterPress,
  placeholder = "Buscar propiedades..."
}: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 py-2">
      <Ionicons name="search-outline" size={18} color="#6B7280" />
      <TextInput 
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        className="flex-1 px-2 py-1" 
      />
      {onFilterPress && (
        <Pressable className="ml-2 p-2" onPress={onFilterPress}>
          <Ionicons name="options-outline" size={18} color="#11181C" />
        </Pressable>
      )}
    </View>
  );
}