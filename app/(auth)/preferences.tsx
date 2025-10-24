import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SelectableChip from "@/components/SelectableChip";
import StepIndicator from "@/components/StepIndicator";

type PropertyType =
  | "Casa"
  | "Departamento"
  | "Oficina"
  | "Local comercial"
  | "Garaje"
  | "Parqueo"
  | "Galpón"
  | "Terreno";
type Modality = "Alquiler" | "Anticrético";
type Location = "Zona norte" | "Centro" | "Zona sur";

export default function PreferencesScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<
    PropertyType[]
  >([]);
  const [selectedModalities, setSelectedModalities] = useState<Modality[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<Location[]>([]);

  const propertyTypes: PropertyType[] = [
    "Casa",
    "Departamento",
    "Oficina",
    "Local comercial",
    "Garaje",
    "Parqueo",
    "Galpón",
    "Terreno",
  ];

  const modalities: Modality[] = ["Alquiler", "Anticrético"];

  const locations: Location[] = ["Zona norte", "Centro", "Zona sur"];

  const togglePropertyType = (type: PropertyType) => {
    setSelectedPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleModality = (modality: Modality) => {
    setSelectedModalities((prev) =>
      prev.includes(modality)
        ? prev.filter((m) => m !== modality)
        : [...prev, modality]
    );
  };

  const toggleLocation = (location: Location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  const handleSkip = () => {
    // Saltar las preferencias y navegar directamente
    (router as any).replace("/(tabs)");
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    console.log("Preferencias guardadas:", {
      propertyTypes: selectedPropertyTypes,
      modalities: selectedModalities,
      locations: selectedLocations,
    });
    (router as any).replace("/(tabs)");
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 1:
        return "home-outline";
      case 2:
        return "document-text-outline";
      case 3:
        return "location-outline";
      default:
        return "home-outline";
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Tipo de propiedad";
      case 2:
        return "Modalidad";
      case 3:
        return "Ubicación";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 1:
        return "Selecciona los tipos de propiedades que te interesan";
      case 2:
        return "¿Qué modalidad prefieres?";
      case 3:
        return "¿En qué zona te gustaría encontrar propiedades?";
      default:
        return "";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View className="flex-row flex-wrap gap-2">
            {propertyTypes.map((type) => (
              <SelectableChip
                key={type}
                label={type}
                selected={selectedPropertyTypes.includes(type)}
                onPress={() => togglePropertyType(type)}
              />
            ))}
          </View>
        );
      case 2:
        return (
          <View className="flex-row flex-wrap gap-2">
            {modalities.map((modality) => (
              <SelectableChip
                key={modality}
                label={modality}
                selected={selectedModalities.includes(modality)}
                onPress={() => toggleModality(modality)}
              />
            ))}
          </View>
        );
      case 3:
        return (
          <View className="flex-row flex-wrap gap-2">
            {locations.map((location) => (
              <SelectableChip
                key={location}
                label={location}
                selected={selectedLocations.includes(location)}
                onPress={() => toggleLocation(location)}
              />
            ))}
          </View>
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedPropertyTypes.length > 0;
      case 2:
        return selectedModalities.length > 0;
      case 3:
        return selectedLocations.length > 0;
      default:
        return false;
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-end">
          {/* Header */}
          <View className="items-center justify-center py-8 px-5">
            <View className="bg-white/10 rounded-full p-4 mb-4">
              <Ionicons name={getStepIcon() as any} size={40} color="white" />
            </View>
            <Text className="text-3xl font-bold text-white text-center mb-2">
              Elige tus preferencias
            </Text>
            <Text className="text-white/80 text-center text-base px-6">
              Personaliza tu experiencia
            </Text>
          </View>

          {/* Content card */}
          <View className="bg-white rounded-t-3xl px-5 pt-4 pb-8 min-h-[550px]">
            <StepIndicator currentStep={currentStep} totalSteps={3} />

            <View className="flex-1">
              {/* Step title and description */}
              <View className="mb-6 mt-4">
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  {getStepTitle()}
                </Text>
                <Text className="text-base text-gray-600">
                  {getStepDescription()}
                </Text>
              </View>

              {/* Step content */}
              <View className="mb-8">{renderStepContent()}</View>
            </View>

            {/* Action buttons */}
            <View className="gap-3 mt-auto pt-4">
              {/* Botón principal: Siguiente/Finalizar */}
              <Pressable
                className={`rounded-xl py-3 items-center ${
                  canProceed() ? "bg-gray-900" : "bg-gray-300"
                }`}
                onPress={handleNext}
                disabled={!canProceed()}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <Text
                  className={`font-semibold text-base ${
                    canProceed() ? "text-white" : "text-gray-500"
                  }`}
                >
                  {currentStep === 3 ? "Finalizar" : "Siguiente"}
                </Text>
              </Pressable>

              {/* Botón Omitir */}
              <Pressable
                className="w-full py-3 bg-white border-2 border-gray-200 rounded-xl items-center"
                onPress={handleSkip}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <Text className="text-gray-700 font-semibold text-base">
                  Omitir
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
