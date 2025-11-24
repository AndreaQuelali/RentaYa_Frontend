import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PhotoUrlPicker from "./PhotoUpload";
import { usePropertyForm } from "@/hooks/properties/usePropertyForm";
import { FormField } from "./property-form/FormField";
import { SelectField } from "./property-form/SelectField";
import { UserProperty } from "@/types/property";
import LocationPicker from "./LocationPicker";
import {
  useOperationTypes,
  usePropertyTypes,
  useProvinces,
  usePaymentTypes,
} from "@/hooks/property/use-catalogs";

interface NewPropertyFormProps {
  propertyToEdit?: UserProperty | null;
  onSuccess?: () => void;
}

export default function NewPropertyForm({
  propertyToEdit,
  onSuccess,
}: NewPropertyFormProps) {
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showModePicker, setShowModePicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);

  // Obtener datos del backend
  const { data: propertyTypesData, isLoading: isLoadingPropertyTypes } =
    usePropertyTypes();
  const { data: operationTypesData, isLoading: isLoadingOperationTypes } =
    useOperationTypes();
  const { data: provincesData, isLoading: isLoadingProvinces } = useProvinces();
  const { data: paymentTypesData, isLoading: isLoadingPaymentTypes } =
    usePaymentTypes();

  const { formData, updateField, submitting, submitForm } = usePropertyForm({
    propertyToEdit,
    onSuccess,
    catalogs: {
      propertyTypes: propertyTypesData,
      operationTypes: operationTypesData,
      provinces: provincesData,
      paymentTypes: paymentTypesData,
    },
  });

  // Transformar datos para los selectores
  const propertyTypesOptions = propertyTypesData?.map((pt) => pt.name) || [];
  const operationTypesOptions = operationTypesData?.map((ot) => ot.name) || [];
  const provincesOptions = provincesData?.map((p) => p.name) || [];
  const paymentTypesOptions = paymentTypesData?.map((pt) => pt.name) || [];

  return (
    <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
      <View className="p-4">
        <Text className="text-xl font-semibold text-center mb-4">
          {propertyToEdit ? "Editar propiedad" : "Nueva propiedad"}
        </Text>

        <View className="gap-3">
          <FormField
            label="Título"
            placeholder="Escribe aquí"
            value={formData.title}
            onChangeText={(text) => updateField("title", text)}
          />

          {isLoadingProvinces ? (
            <View className="py-4">
              <ActivityIndicator size="small" color="#D65E48" />
            </View>
          ) : (
            <SelectField
              label="Provincia"
              placeholder="Seleccione la provincia"
              value={formData.city}
              options={provincesOptions}
              isOpen={showCityPicker}
              onToggle={() => setShowCityPicker((prev) => !prev)}
              onSelect={(value) => updateField("city", value)}
            />
          )}

          {/* Selección de ubicación */}
          <View>
            <Text className="text-sm font-medium mb-2 text-gray-900">
              Ubicación
            </Text>
            {!formData.latitude || !formData.longitude ? (
              <Pressable
                onPress={() => setShowLocationPicker(true)}
                className="bg-primary rounded-xl py-4 px-4 flex-row items-center justify-center border-2 border-primary"
              >
                <Ionicons name="map-outline" size={20} color="#fff" />
                <Text className="text-white font-semibold ml-2">
                  Seleccionar ubicación en mapa
                </Text>
              </Pressable>
            ) : (
              <View className="bg-green-50 rounded-xl p-4 border border-green-200">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#059669"
                    />
                    <Text className="text-sm font-medium text-green-800 ml-2">
                      Ubicación confirmada
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setShowLocationPicker(true)}
                    className="px-3 py-1 bg-green-100 rounded-full"
                  >
                    <Text className="text-xs text-green-700 font-medium">
                      Cambiar
                    </Text>
                  </Pressable>
                </View>
                <View className="bg-white rounded-lg p-3 mt-2">
                  <View className="flex-row items-center">
                    <Ionicons name="map-outline" size={16} color="#059669" />
                    <Text className="text-xs text-gray-600 ml-2 font-mono">
                      Lat: {formData.latitude.toFixed(6)}, Lng:{" "}
                      {formData.longitude.toFixed(6)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Modal de selección de ubicación */}
          <LocationPicker
            visible={showLocationPicker}
            onClose={() => setShowLocationPicker(false)}
            onSelect={(lat, lng) => {
              updateField("latitude", lat);
              updateField("longitude", lng);
              // Si no hay dirección, usar coordenadas como referencia
              if (!formData.address) {
                updateField("address", `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
              }
            }}
            initialLatitude={formData.latitude}
            initialLongitude={formData.longitude}
            address={formData.address}
            city={formData.city}
          />

          {isLoadingPropertyTypes ? (
            <View className="py-4">
              <ActivityIndicator size="small" color="#D65E48" />
            </View>
          ) : (
            <SelectField
              label="Tipo de propiedad"
              placeholder="Seleccione el tipo de propiedad"
              value={formData.type}
              options={propertyTypesOptions}
              isOpen={showTypePicker}
              onToggle={() => setShowTypePicker((prev) => !prev)}
              onSelect={(value) => updateField("type", value)}
            />
          )}

          <FormField
            label="Precio (Bs)"
            placeholder="Escribe aquí"
            keyboardType="numeric"
            value={formData.price}
            onChangeText={(text) => updateField("price", text)}
          />

          {isLoadingPaymentTypes ? (
            <View className="py-4">
              <ActivityIndicator size="small" color="#D65E48" />
            </View>
          ) : (
            <SelectField
              label="Tipo de pago"
              placeholder="Seleccione el tipo de pago"
              value={formData.paymentType || ""}
              options={paymentTypesOptions}
              isOpen={showPaymentPicker}
              onToggle={() => setShowPaymentPicker((prev) => !prev)}
              onSelect={(value) => updateField("paymentType", value)}
            />
          )}

          {isLoadingOperationTypes ? (
            <View className="py-4">
              <ActivityIndicator size="small" color="#D65E48" />
            </View>
          ) : (
            <SelectField
              label="Modalidad"
              placeholder="Seleccione la modalidad"
              value={formData.dealMode}
              options={operationTypesOptions}
              isOpen={showModePicker}
              onToggle={() => setShowModePicker((prev) => !prev)}
              onSelect={(value) => updateField("dealMode", value)}
            />
          )}

          <FormField
            label="Área (m²)"
            placeholder="Ej. 80"
            keyboardType="numeric"
            value={formData.area}
            onChangeText={(text) => updateField("area", text)}
          />

          <FormField
            label="Descripción"
            placeholder="Escribe aquí"
            value={formData.description}
            onChangeText={(text) => updateField("description", text)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <View>
            <PhotoUrlPicker
              value={formData.photos}
              onChange={(photos) => updateField("photos", photos)}
              title="Fotos (URLs)"
            />
          </View>
        </View>

        <Pressable
          disabled={submitting}
          onPress={submitForm}
          className={`bg-black rounded-xl py-4 items-center mt-6 ${
            submitting ? "opacity-50" : "opacity-100"
          }`}
        >
          <Text className="text-white font-semibold">
            {submitting
              ? propertyToEdit
                ? "Actualizando..."
                : "Publicando..."
              : propertyToEdit
                ? "Actualizar"
                : "Publicar"}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
