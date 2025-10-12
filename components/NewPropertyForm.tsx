import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert, Image } from 'react-native';
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
  const typeOptions = ['Casa', 'Departamento', 'Tienda', 'Terreno'];
  const modeOptions = ['Alquiler', 'Anticrético'];

  // Photos state (placeholder without picker wiring)
  type Photo = { uri: string; name?: string; size?: number; mime?: string };
  const [photos, setPhotos] = useState<Photo[]>([]);

  // Errors state
  const [errors, setErrors] = useState<{
    title?: string;
    city?: string;
    type?: string;
    price?: string;
    dealMode?: string;
    desc?: string;
    photos?: string;
  }>({});

  // Regex and validators
  const titleRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ,.;:!¡?¿()"'\-]{1,100}$/;
  const cityRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]{1,50}$/;
  const priceRegex = /^[1-9][0-9]*$/; // positive integers only
  const descAllowed = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ,.\-;:!¡?¿()"'\n\r]{1,1000}$/;

  const validateTitle = (v: string) => {
    const val = v.trim();
    if (!val) return 'El título es obligatorio.';
    if (val.length > 100) return 'El título no puede exceder 100 caracteres.';
    if (!titleRegex.test(val)) return 'El título solo permite letras, números y caracteres básicos (,.-).';
    return undefined;
  };

  const validateCity = (v: string) => {
    const val = v.trim();
    if (!val) return 'La ubicación es obligatoria.';
    if (val.length > 50) return 'La ubicación no puede exceder 50 caracteres.';
    if (!cityRegex.test(val)) return 'La ubicación solo permite letras, números y espacios.';
    return undefined;
  };

  const validateType = (v: string) => {
    if (!v) return 'El tipo de propiedad es obligatorio.';
    if (!typeOptions.includes(v)) return 'Selecciona un tipo de propiedad válido.';
    return undefined;
  };

  const validatePrice = (v: string) => {
    const val = v.trim();
    if (!val) return 'El precio es obligatorio.';
    if (!priceRegex.test(val)) return 'El precio debe ser un número entero positivo.';
    return undefined;
  };

  const validateDealMode = (v: string) => {
    if (!v) return 'La modalidad es obligatoria.';
    if (!modeOptions.includes(v)) return 'Selecciona una modalidad válida (Alquiler o Anticrético).';
    return undefined;
  };

  const validateDesc = (v: string) => {
    const val = v.trim();
    if (!val) return 'La descripción es obligatoria.';
    if (val.length > 1000) return 'La descripción no puede exceder 1000 caracteres.';
    if (!descAllowed.test(val)) return 'La descripción contiene caracteres no permitidos.';
    return undefined;
  };

  const validatePhotos = (items: Photo[]) => {
    if (!items || items.length === 0) return 'Debes subir al menos una foto.';
    for (const p of items) {
      const name = (p.name || p.uri || '').toLowerCase();
      const isJpg = name.endsWith('.jpg') || name.endsWith('.jpeg');
      const isPng = name.endsWith('.png');
      if (!isJpg && !isPng) return 'Las fotos deben ser JPG o PNG.';
      if (typeof p.size === 'number' && p.size > 5 * 1024 * 1024) return 'Cada foto no debe exceder los 5 MB.';
      // If size unknown, allow but prefer to verify at upload time
    }
    return undefined;
  };

  const validateAll = () => {
    const newErrors = {
      title: validateTitle(title),
      city: validateCity(city),
      type: validateType(type),
      price: validatePrice(price),
      dealMode: validateDealMode(dealMode),
      desc: validateDesc(desc),
      photos: validatePhotos(photos),
    };
    setErrors(newErrors);
    return newErrors;
  };

  // Memoized validity check without mutating state during render
  const isFormValid = useMemo(() => {
    const e = {
      title: validateTitle(title),
      city: validateCity(city),
      type: validateType(type),
      price: validatePrice(price),
      dealMode: validateDealMode(dealMode),
      desc: validateDesc(desc),
      photos: validatePhotos(photos),
    };
    return !Object.values(e).some(Boolean);
  }, [title, city, type, price, dealMode, desc, photos]);

  const handlePickPhotos = () => {
    Alert.alert(
      'Seleccionar fotos',
      'Integración de selección de imágenes pendiente. Para habilitarla, instala y configura expo-image-picker. Mientras tanto, esta es una vista previa de validaciones.',
    );
  };

  const handlePublish = () => {
    const e = validateAll();
    if (Object.values(e).some(Boolean)) {
      Alert.alert('Revisa el formulario', 'Hay campos vacíos, datos inválidos o archivos no permitidos.');
      return;
    }
    // TO DO: continuar con la publicación (llamar API)
    Alert.alert('Listo', 'La propiedad pasa las validaciones.');
  };

  return (
    <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
      <View className="p-4">
        <Text className="text-xl font-semibold text-center mb-4">Nueva propiedad</Text>

        <View className="gap-3">
          <View>
            <Text className="text-sm font-medium mb-1">Título</Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-3"
              placeholder="Escribe aquí"
              value={title}
              onChangeText={(t) => {
                setTitle(t);
                if (errors.title) setErrors((p) => ({ ...p, title: undefined }));
              }}
              onBlur={() => setErrors((p) => ({ ...p, title: validateTitle(title) }))}
              maxLength={100}
            />
            {errors.title ? <Text className="text-red-500 text-xs mt-1">{errors.title}</Text> : null}
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Ubicación</Text>
            <View className="border border-gray-200 rounded-xl px-3 py-3 flex-row items-center gap-2">
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <TextInput
                className="flex-1"
                placeholder="Ciudad"
                value={city}
                onChangeText={(t) => {
                  setCity(t);
                  if (errors.city) setErrors((p) => ({ ...p, city: undefined }));
                }}
                onBlur={() => setErrors((p) => ({ ...p, city: validateCity(city) }))}
                maxLength={50}
              />
            </View>
            {errors.city ? <Text className="text-red-500 text-xs mt-1">{errors.city}</Text> : null}
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
                  <Pressable key={opt} className="px-4 py-3 bg-white" onPress={() => { setType(opt); setShowTypePicker(false); if (errors.type) setErrors((p) => ({ ...p, type: undefined })); }}>
                    <Text>{opt}</Text>
                  </Pressable>
                ))}
              </View>
            )}
            {errors.type ? <Text className="text-red-500 text-xs mt-1">{errors.type}</Text> : null}
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Precio</Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-3"
              placeholder="Escribe aquí"
              keyboardType="numeric"
              value={price}
              onChangeText={(t) => {
                // keep only digits
                const onlyDigits = t.replace(/[^0-9]/g, '');
                setPrice(onlyDigits);
                if (errors.price) setErrors((p) => ({ ...p, price: undefined }));
              }}
              onBlur={() => setErrors((p) => ({ ...p, price: validatePrice(price) }))}
            />
            {errors.price ? <Text className="text-red-500 text-xs mt-1">{errors.price}</Text> : null}
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
                  <Pressable key={opt} className="px-4 py-3 bg-white" onPress={() => { setDealMode(opt); setShowModePicker(false); if (errors.dealMode) setErrors((p) => ({ ...p, dealMode: undefined })); }}>
                    <Text>{opt}</Text>
                  </Pressable>
                ))}
              </View>
            )}
            {errors.dealMode ? <Text className="text-red-500 text-xs mt-1">{errors.dealMode}</Text> : null}
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Descripción</Text>
            <TextInput
              className="border border-gray-200 rounded-xl px-4 py-3"
              placeholder="Escribe aquí"
              value={desc}
              onChangeText={(t) => {
                setDesc(t);
                if (errors.desc) setErrors((p) => ({ ...p, desc: undefined }));
              }}
              onBlur={() => setErrors((p) => ({ ...p, desc: validateDesc(desc) }))}
              multiline
              numberOfLines={4}
              maxLength={1000}
            />
            <Text className="text-gray-400 text-xs mt-1">{`${desc.length}/1000`}</Text>
            {errors.desc ? <Text className="text-red-500 text-xs mt-1">{errors.desc}</Text> : null}
          </View>

          <View>
            <Text className="text-sm font-medium mb-1">Fotos</Text>
            <View className="border border-gray-200 rounded-xl px-4 py-8 items-center justify-center">
              <Ionicons name="cloud-upload-outline" size={28} color="#6B7280" />
              <Text className="text-gray-500 text-xs mt-2 text-center">Arrastra tus fotos aquí o haz clic para seleccionar</Text>
              <Pressable className="mt-3 border border-gray-300 rounded-lg px-3 py-2" onPress={handlePickPhotos}>
                <Text>Seleccionar fotos</Text>
              </Pressable>
              {/* Thumbnails preview (URIs only if available) */}
              {photos.length > 0 ? (
                <View className="w-full mt-3" style={{ rowGap: 8 }}>
                  {photos.map((p, idx) => (
                    <View key={`${p.uri}-${idx}`} className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
                        {p.uri ? (
                          <Image source={{ uri: p.uri }} style={{ width: 40, height: 40, borderRadius: 6 }} />
                        ) : (
                          <Ionicons name="image-outline" size={24} color="#6B7280" />
                        )}
                        <Text className="text-xs" numberOfLines={1}>
                          {p.name || p.uri}
                        </Text>
                      </View>
                      <Pressable onPress={() => {
                        setPhotos((list) => list.filter((_, i) => i !== idx));
                        if (errors.photos) setErrors((pErr) => ({ ...pErr, photos: undefined }));
                      }}>
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
            {errors.photos ? <Text className="text-red-500 text-xs mt-1">{errors.photos}</Text> : null}
          </View>
        </View>

        <Pressable
          className={`rounded-xl py-4 items-center mt-6 ${isFormValid ? 'bg-black' : 'bg-gray-300'}`}
          disabled={!isFormValid}
          onPress={handlePublish}
        >
          <Text className="text-white font-semibold">Publicar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
