import { View, Text } from "react-native";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
}: StepIndicatorProps) {
  return (
    <View className="w-full px-5 py-4">
      {/* Progress bar */}
      <View className="flex-row gap-2 mb-3">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View
            key={index}
            className={`flex-1 h-1.5 rounded-full ${
              index < currentStep ? "bg-primary" : "bg-gray-200"
            }`}
          />
        ))}
      </View>

      {/* Step counter */}
      <Text className="text-sm text-gray-500 text-center">
        Paso {currentStep} de {totalSteps}
      </Text>
    </View>
  );
}
