import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PhotoUrlPicker from './PhotoUpload';
import { api } from '../lib/api';

export default function NewPropertyForm() {
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [price, setPrice] = useState('');
  const [dealMode, setDealMode] = useState('');
  const [desc, setDesc] = useState('');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showModePicker, setShowModePicker] = useState(false);
  const typeOptions = ['Casa', 'Departamento', 'Oficina', 'Terreno'];
  const modeOptions = ['Alquiler', 'Anticrético'];

  const normalizeDealMode = (mode: string) => {
    const m = mode.toLowerCase();
    if (m.startsWith('alquiler')) return 'alquiler';
    if (m.normalize('NFD').replace(/\p{Diacritic}/gu, '') === 'anticretico') return 'anticretico';
    return '';
  };

  const onSubmit = async () => {
    try {
      if (!title.trim()) {
        Alert.alert('Falta título', 'Por favor ingresa un título');
        return;
      }
      if (!price || isNaN(Number(price))) {
        Alert.alert('Precio inválido', 'Ingresa un precio numérico');
        return;
      }
      const tipoOperacion = normalizeDealMode(dealMode);
      if (!tipoOperacion) {
        Alert.alert('Modalidad inválida', 'Selecciona Alquiler o Anticrético');
        return;
      }

      const payload: any = {
        titulo: title.trim(),
        descripcion: desc?.trim() || undefined,
        direccion: address.trim(),
        ciudad: city?.trim() || undefined,
        dormitorios: 1,
        banos: 1,
        areaM2: area ? Number(area) : undefined,
        precio: Number(price),
        tipoOperacion,
        fotos: photos && photos.length > 0 ? photos : undefined,
      };

      setSubmitting(true);
      const res = await api.post('/api/inmuebles', payload);
      setSubmitting(false);

      Alert.alert('Éxito', 'Propiedad publicada correctamente');
     
      setTitle('');
      setCity('');
      setType('');
      setPrice('');
      setDealMode('');
      setDesc('');
      setAddress('');
      setArea('');
      setPhotos([]);
    } catch (error: any) {
      setSubmitting(false);
      const msg = error?.response?.data?.message || 'No se pudo publicar. Intenta nuevamente.';
      Alert.alert('Error', msg);
    }
  };

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
            <View className="border border-gray-200 rounded-xl px-3 py-3 flex-row items-center gap-2 mt-2">
              <Ionicons name="home-outline" size={16} color="#6B7280" />
              <TextInput className="flex-1" placeholder="Ubicación (Av. Principal 123)" value={address} onChangeText={setAddress} />
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
            <Text className="text-sm font-medium mb-1">Área (m²)</Text>
            <TextInput className="border border-gray-200 rounded-xl px-4 py-3" placeholder="Ej. 80" keyboardType="numeric" value={area} onChangeText={setArea} />
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Descripción</Text>
            <TextInput className="border border-gray-200 rounded-xl px-4 py-3" placeholder="Escribe aquí" value={desc} onChangeText={setDesc} multiline numberOfLines={4} />
          </View>

          <View>
            <PhotoUrlPicker value={photos} onChange={setPhotos} title="Fotos (URLs)" />
          </View>

        </View>

        <Pressable disabled={submitting} onPress={onSubmit} className="bg-black rounded-xl py-4 items-center mt-6 opacity-100">
          <Text className="text-white font-semibold">{submitting ? 'Publicando...' : 'Publicar'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
