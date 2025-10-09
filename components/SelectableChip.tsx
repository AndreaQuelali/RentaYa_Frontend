import { Pressable, Text } from "react-native";

interface SelectableChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export default function SelectableChip({
  label,
  selected,
  onPress,
}: SelectableChipProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`
        px-5 py-3 rounded-full border-2
        ${selected ? "bg-primary border-primary" : "bg-white border-gray-300"}
      `}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text
        className={`
          text-sm font-medium text-center
          ${selected ? "text-white" : "text-gray-700"}
        `}
      >
        {label}
      </Text>
    </Pressable>
  );
}
