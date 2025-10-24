import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NewPropertyForm() {
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [dealMode, setDealMode] = useState('');
  const [desc, setDesc] = useState('');
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showModePicker, setShowModePicker] = useState(false);
  const typeOptions = ['Casa', 'Departamento', 'Oficina', 'Terreno'];
  const modeOptions = ['Alquiler', 'Venta', 'Anticrético'];

  return (
    <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
      <View className="p-4">
        <Text className="text-xl font-semibold text-center mb-4">Nueva propiedad</Text>

        <View className="gap-3">
          <View>
            <Text className="text-sm font-medium mb-1">Título</Text>
            <TextInput className="border border-gray-200 rounded-xl px-4 py-3" placeholder="Escribe aquí" value={title} onChangeText={setTitle} />
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Ubicación</Text>
            <View className="border border-gray-200 rounded-xl px-3 py-3 flex-row items-center gap-2">
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <TextInput className="flex-1" placeholder="Ciudad" value={city} onChangeText={setCity} />
            </View>
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Tipo de propiedad</Text>
            <Pressable className="border border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between" onPress={() => setShowTypePicker((s) => !s)}>
              <Text className={type ? 'text-black' : 'text-gray-400'}>{type || 'Seleccione el tipo de propiedad'}</Text>
              <Ionicons name={showTypePicker ? 'chevron-up' : 'chevron-down'} size={18} color="#6B7280" />
            </Pressable>
            {showTypePicker && (
              <View className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                {typeOptions.map((opt) => (
                  <Pressable key={opt} className="px-4 py-3 bg-white" onPress={() => { setType(opt); setShowTypePicker(false); }}>
                    <Text>{opt}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Precio</Text>
            <TextInput className="border border-gray-200 rounded-xl px-4 py-3" placeholder="Escribe aquí" keyboardType="numeric" value={price} onChangeText={setPrice} />
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Modalidad</Text>
            <Pressable className="border border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between" onPress={() => setShowModePicker((s) => !s)}>
              <Text className={dealMode ? 'text-black' : 'text-gray-400'}>{dealMode || 'Seleccione la modalidad'}</Text>
              <Ionicons name={showModePicker ? 'chevron-up' : 'chevron-down'} size={18} color="#6B7280" />
            </Pressable>
            {showModePicker && (
              <View className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                {modeOptions.map((opt) => (
                  <Pressable key={opt} className="px-4 py-3 bg-white" onPress={() => { setDealMode(opt); setShowModePicker(false); }}>
                    <Text>{opt}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Descripción</Text>
            <TextInput className="border border-gray-200 rounded-xl px-4 py-3" placeholder="Escribe aquí" value={desc} onChangeText={setDesc} multiline numberOfLines={4} />
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Fotos</Text>
            <View className="border border-gray-200 rounded-xl px-4 py-8 items-center justify-center">
              <Ionicons name="cloud-upload-outline" size={28} color="#6B7280" />
              <Text className="text-gray-500 text-xs mt-2 text-center">Arrastra tus fotos aquí o haz clic para seleccionar</Text>
              <Pressable className="mt-3 border border-gray-300 rounded-lg px-3 py-2">
                <Text>Seleccionar fotos</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <Pressable className="bg-black rounded-xl py-4 items-center mt-6">
          <Text className="text-white font-semibold">Publicar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
