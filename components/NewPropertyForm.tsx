import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { inmuebleService } from "@/lib/services/inmuebleService";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  propertySchema,
  PropertyFormData,
} from "@/lib/validation/propertySchema";

interface NewPropertyFormProps {
  onSuccess?: () => void;
}

export default function NewPropertyForm({ onSuccess }: NewPropertyFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showModePicker, setShowModePicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);

  const typeOptions = [
    { label: "Casa", value: "casa" },
    { label: "Departamento", value: "departamento" },
    { label: "Oficina", value: "oficina" },
    { label: "Terreno", value: "terreno" },
  ];

  const modeOptions = [
    { label: "Alquiler", value: "alquiler" },
    { label: "Anticrético", value: "anticretico" },
    { label: "Venta", value: "venta" },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: "",
      address: "",
      city: "Cochabamba",
      propertyType: "",
      bedrooms: "",
      bathrooms: "",
      areaM2: "",
      price: "",
      dealMode: "",
      description: "",
      images: [],
    },
  });

  const images = watch("images");

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Se necesita permiso para acceder a la galería de fotos"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
      quality: 0.8,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => asset.uri);
      setValue("images", [...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setValue(
      "images",
      images.filter((_, i) => i !== index)
    );
  };

  const onSubmit = async (data: PropertyFormData) => {
    setIsLoading(true);
    try {
      Alert.alert("Subiendo imágenes", "Por favor espere...");
      const uploadedUrls = await inmuebleService.uploadImages(data.images);

      const payload = {
        title: data.title.trim(),
        description: data.description?.trim() || undefined,
        address: data.address.trim(),
        city: data.city.trim(),
        propertyType: data.propertyType || undefined,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : undefined,
        bathrooms: data.bathrooms ? parseInt(data.bathrooms) : undefined,
        areaM2: data.areaM2 ? parseFloat(data.areaM2) : undefined,
        price: parseFloat(data.price),
        operationType: data.dealMode as "alquiler" | "anticretico",
        photos: uploadedUrls,
      };

      await inmuebleService.createInmueble(payload);

      Alert.alert("Éxito", "Propiedad publicada correctamente", [
        {
          text: "OK",
          onPress: () => {
            if (onSuccess) {
              onSuccess();
            } else {
              router.back();
            }
          },
        },
      ]);
    } catch (error: any) {
      console.error("Error al publicar:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error al publicar la propiedad";
      Alert.alert("Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
      <View className="p-4">
        <Text className="text-xl font-semibold text-center mb-4">
          Nueva propiedad
        </Text>

        <View className="gap-3">
          {/* Título */}
          <View>
            <Text className="text-sm font-medium mb-1">
              Título <Text className="text-red-500">*</Text>
            </Text>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border border-gray-200 rounded-xl px-4 py-3"
                  placeholder="Ej: Casa moderna en zona sur"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.title && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </Text>
            )}
          </View>

          {/* Dirección */}
          <View>
            <Text className="text-sm font-medium mb-1">
              Dirección <Text className="text-red-500">*</Text>
            </Text>
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border border-gray-200 rounded-xl px-4 py-3"
                  placeholder="Ej: Av. América #123"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.address && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.address.message}
              </Text>
            )}
          </View>

          {/* Ciudad */}
          <View>
            <Text className="text-sm font-medium mb-1">
              Ciudad <Text className="text-red-500">*</Text>
            </Text>
            <Controller
              control={control}
              name="city"
              render={({ field: { onChange, onBlur, value } }) => (
                <View className="border border-gray-200 rounded-xl px-3 py-3 flex-row items-center gap-2">
                  <Ionicons name="location-outline" size={16} color="#6B7280" />
                  <TextInput
                    className="flex-1"
                    placeholder="Ej: Cochabamba"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                </View>
              )}
            />
            {errors.city && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.city.message}
              </Text>
            )}
          </View>

          {/* Tipo de Propiedad */}
          <View>
            <Text className="text-sm font-medium mb-1">Tipo de propiedad</Text>
            <Controller
              control={control}
              name="propertyType"
              render={({ field: { onChange, value } }) => (
                <>
                  <Pressable
                    className="border border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between"
                    onPress={() => setShowTypePicker((s) => !s)}
                  >
                    <Text className={value ? "text-black" : "text-gray-400"}>
                      {value
                        ? typeOptions.find((t) => t.value === value)?.label
                        : "Seleccione el tipo de propiedad"}
                    </Text>
                    <Ionicons
                      name={showTypePicker ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#6B7280"
                    />
                  </Pressable>
                  {showTypePicker && (
                    <View className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                      {typeOptions.map((opt) => (
                        <Pressable
                          key={opt.value}
                          className="px-4 py-3 bg-white border-b border-gray-100"
                          onPress={() => {
                            onChange(opt.value);
                            setShowTypePicker(false);
                          }}
                        >
                          <Text>{opt.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </>
              )}
            />
            {errors.propertyType && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.propertyType.message}
              </Text>
            )}
          </View>

          {/* Dormitorios y Baños */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-sm font-medium mb-1">Dormitorios</Text>
              <Controller
                control={control}
                name="bedrooms"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-200 rounded-xl px-4 py-3"
                    placeholder="0"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.bedrooms && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.bedrooms.message}
                </Text>
              )}
            </View>

            <View className="flex-1">
              <Text className="text-sm font-medium mb-1">Baños</Text>
              <Controller
                control={control}
                name="bathrooms"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-200 rounded-xl px-4 py-3"
                    placeholder="0"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.bathrooms && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.bathrooms.message}
                </Text>
              )}
            </View>
          </View>

          {/* Área */}
          <View>
            <Text className="text-sm font-medium mb-1">Área (m²)</Text>
            <Controller
              control={control}
              name="areaM2"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border border-gray-200 rounded-xl px-4 py-3"
                  placeholder="Ej: 120.5"
                  keyboardType="decimal-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.areaM2 && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.areaM2.message}
              </Text>
            )}
          </View>

          {/* Precio */}
          <View>
            <Text className="text-sm font-medium mb-1">
              Precio (Bs) <Text className="text-red-500">*</Text>
            </Text>
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border border-gray-200 rounded-xl px-4 py-3"
                  placeholder="Ej: 5000"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            {errors.price && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.price.message}
              </Text>
            )}
          </View>

          {/* Modalidad */}
          <View>
            <Text className="text-sm font-medium mb-1">
              Modalidad <Text className="text-red-500">*</Text>
            </Text>
            <Controller
              control={control}
              name="dealMode"
              render={({ field: { onChange, value } }) => (
                <>
                  <Pressable
                    className="border border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between"
                    onPress={() => setShowModePicker((s) => !s)}
                  >
                    <Text className={value ? "text-black" : "text-gray-400"}>
                      {value
                        ? modeOptions.find((m) => m.value === value)?.label
                        : "Seleccione la modalidad"}
                    </Text>
                    <Ionicons
                      name={showModePicker ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#6B7280"
                    />
                  </Pressable>
                  {showModePicker && (
                    <View className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                      {modeOptions.map((opt) => (
                        <Pressable
                          key={opt.value}
                          className="px-4 py-3 bg-white"
                          onPress={() => {
                            onChange(opt.value);
                            setShowModePicker(false);
                          }}
                        >
                          <Text>{opt.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                </>
              )}
            />
            {errors.dealMode && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.dealMode.message}
              </Text>
            )}
          </View>

          {/* Descripción */}
          <View>
            <Text className="text-sm font-medium mb-1">Descripción</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="border border-gray-200 rounded-xl px-4 py-3"
                  placeholder="Describe las características de la propiedad..."
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              )}
            />
            {errors.description && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </Text>
            )}
          </View>

          {/* Fotos */}
          <View>
            <Text className="text-sm font-medium mb-1">
              Fotos <Text className="text-red-500">*</Text>
            </Text>

            {/* Área de carga */}
            <Pressable
              className="border border-gray-200 rounded-xl px-4 py-8 items-center justify-center"
              onPress={pickImages}
              disabled={isLoading}
            >
              <Ionicons name="cloud-upload-outline" size={28} color="#6B7280" />
              <Text className="text-gray-500 text-xs mt-2 text-center">
                Toca para seleccionar fotos de tu galería
              </Text>
              <View className="mt-3 border border-gray-300 rounded-lg px-3 py-2">
                <Text>Seleccionar fotos</Text>
              </View>
            </Pressable>

            {/* Previsualización de imágenes */}
            {images.length > 0 && (
              <View className="mt-3">
                <Text className="text-xs text-gray-600 mb-2">
                  {images.length}{" "}
                  {images.length === 1
                    ? "foto seleccionada"
                    : "fotos seleccionadas"}
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="gap-2"
                >
                  {images.map((uri, index) => (
                    <View key={index} className="relative mr-2">
                      <Image
                        source={{ uri }}
                        className="w-24 h-24 rounded-lg"
                        resizeMode="cover"
                      />
                      <Pressable
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                        onPress={() => removeImage(index)}
                        disabled={isLoading}
                      >
                        <Ionicons name="close" size={16} color="white" />
                      </Pressable>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {errors.images && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.images.message}
              </Text>
            )}
          </View>
        </View>

        {/* Botón Publicar */}
        <Pressable
          className={`rounded-xl py-4 items-center mt-6 ${
            isLoading ? "bg-gray-400" : "bg-black"
          }`}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator color="white" />
              <Text className="text-white font-semibold">Publicando...</Text>
            </View>
          ) : (
            <Text className="text-white font-semibold">Publicar</Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}
