import { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SelectableChip from "@/components/SelectableChip";
import StepIndicator from "@/components/StepIndicator";
import { useSavePreferences } from "@/hooks/auth/use-preferences";
import { PROPERTY_TYPES, OPERATION_MODES } from "@/constants/propertyOptions";
import { PROVINCIAS } from "@/constants/provinces";

export default function PreferencesScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>(
    []
  );
  const [selectedModality, setSelectedModality] = useState<string>("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const { mutate: savePreferences, isPending } = useSavePreferences();

  const propertyTypes = [...PROPERTY_TYPES];
  const modalities = OPERATION_MODES.filter((m) => m !== "Venta"); // Solo Alquiler y Anticrético
  const locations = PROVINCIAS;

  const togglePropertyType = (type: string) => {
    setSelectedPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const selectModality = (modality: string) => {
    setSelectedModality(modality);
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location]
    );
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    // Enviar preferencias al backend
    const preferences = {
      propertyTypes: selectedPropertyTypes,
      modality: selectedModality || undefined,
      locations: selectedLocations,
    };

    savePreferences(preferences);
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
        return "Selecciona uno o más tipos de propiedades";
      case 2:
        return "Elige la modalidad que más te convenga";
      case 3:
        return "Selecciona las provincias de tu interés";
      default:
        return "";
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View className="flex-row flex-wrap gap-2 justify-center">
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
          <View className="flex-row flex-wrap gap-2 justify-center">
            {modalities.map((modality) => (
              <SelectableChip
                key={modality}
                label={modality}
                selected={selectedModality === modality}
                onPress={() => selectModality(modality)}
              />
            ))}
          </View>
        );
      case 3:
        return (
          <View className="flex-row flex-wrap gap-2 justify-center">
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
        return selectedModality !== "";
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
          <View className="items-center justify-center py-8 px-5">
            <View className="bg-white/10 rounded-full p-4 mb-4">
              <Ionicons name={getStepIcon() as any} size={40} color="white" />
            </View>
            <Text className="text-3xl font-bold text-white text-center mb-2">
              ¡Bienvenido a RentaYa!
            </Text>
            <Text className="text-white/80 text-center text-base px-6">
              Personaliza tu búsqueda de propiedades
            </Text>
          </View>

          <View className="bg-white rounded-t-3xl px-5 pt-4 pb-8 min-h-[550px]">
            <StepIndicator currentStep={currentStep} totalSteps={3} />

            <View className="flex-1">
              <View className="mb-6 mt-4">
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  {getStepTitle()}
                </Text>
                <Text className="text-base text-gray-600">
                  {getStepDescription()}
                </Text>
              </View>

              <ScrollView
                className="flex-1 mb-4"
                showsVerticalScrollIndicator={false}
              >
                {renderStepContent()}
              </ScrollView>
            </View>

            <View className="gap-3 mt-auto pt-4">
              <Pressable
                className={`rounded-xl py-4 items-center ${
                  canProceed() && !isPending ? "bg-gray-900" : "bg-gray-300"
                }`}
                onPress={handleNext}
                disabled={!canProceed() || isPending}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <Text
                  className={`font-semibold text-base ${
                    canProceed() && !isPending ? "text-white" : "text-gray-500"
                  }`}
                >
                  {isPending
                    ? "Guardando..."
                    : currentStep === 3
                      ? "Finalizar"
                      : "Siguiente"}
                </Text>
              </Pressable>

              {currentStep > 1 && (
                <Pressable
                  className="w-full py-4 bg-white border-2 border-gray-200 rounded-xl items-center flex-row justify-center gap-2"
                  onPress={handleBack}
                  disabled={isPending}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <Ionicons name="arrow-back" size={20} color="#374151" />
                  <Text className="text-gray-700 font-semibold text-base">
                    Atrás
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
