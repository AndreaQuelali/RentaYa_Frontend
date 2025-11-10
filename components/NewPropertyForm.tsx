import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import PhotoUrlPicker from "./PhotoUpload";
import { usePropertyForm } from "@/hooks/properties/usePropertyForm";
import { FormField } from "./property-form/FormField";
import { SelectField } from "./property-form/SelectField";
import { PROPERTY_TYPES, OPERATION_MODES } from "@/constants/propertyOptions";
import { UserProperty } from "@/types/property";
import { PROVINCIAS } from "@/constants/provinces";
import AddressMapPreview from "./AddressMapPreview";

interface NewPropertyFormProps {
  propertyToEdit?: UserProperty | null;
  onSuccess?: () => void;
}

export default function NewPropertyForm({
  propertyToEdit,
  onSuccess,
}: NewPropertyFormProps) {
  const { formData, updateField, submitting, submitForm } = usePropertyForm({
    propertyToEdit,
    onSuccess,
  });

  const [showTypePicker, setShowTypePicker] = useState(false);
  const [showModePicker, setShowModePicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);

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

          <SelectField
            label="Provincia"
            placeholder="Seleccione la provincia"
            value={formData.city}
            options={[...PROVINCIAS]}
            isOpen={showCityPicker}
            onToggle={() => setShowCityPicker((prev) => !prev)}
            onSelect={(value) => updateField("city", value)}
          />

          <View>
            <Text className="text-sm font-medium mb-1 text-gray-900">
              Dirección
            </Text>
            <FormField
              label=""
              placeholder="Av. Principal 123"
              icon="home-outline"
              value={formData.address}
              onChangeText={(text) => updateField("address", text)}
            />
          </View>

          {/* Previsualización del mapa */}
          <AddressMapPreview
            address={formData.address}
            city={formData.city}
            onCoordinatesFound={(lat, lng) => {
              updateField("latitude", lat);
              updateField("longitude", lng);
            }}
          />

          <SelectField
            label="Tipo de propiedad"
            placeholder="Seleccione el tipo de propiedad"
            value={formData.type}
            options={[...PROPERTY_TYPES]}
            isOpen={showTypePicker}
            onToggle={() => setShowTypePicker((prev) => !prev)}
            onSelect={(value) => updateField("type", value)}
          />

          <FormField
            label="Precio (Bs)"
            placeholder="Escribe aquí"
            keyboardType="numeric"
            value={formData.price}
            onChangeText={(text) => updateField("price", text)}
          />

          <SelectField
            label="Modalidad"
            placeholder="Seleccione la modalidad"
            value={formData.dealMode}
            options={[...OPERATION_MODES]}
            isOpen={showModePicker}
            onToggle={() => setShowModePicker((prev) => !prev)}
            onSelect={(value) => updateField("dealMode", value)}
          />

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
