import React, { useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SelectFieldProps {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
  error?: string;
}

const OPTION_HEIGHT = 48;
const MAX_VISIBLE_OPTIONS = 6;
const DROPDOWN_HEIGHT = OPTION_HEIGHT * MAX_VISIBLE_OPTIONS;

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  value,
  placeholder,
  options,
  isOpen,
  onToggle,
  onSelect,
  error,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const triggerRef = useRef<View>(null);
  const [triggerLayout, setTriggerLayout] = React.useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  React.useEffect(() => {
    if (isOpen && triggerRef.current) {
      triggerRef.current.measureInWindow((x, y, width, height) => {
        setTriggerLayout({ x, y, width, height });
      });
    }
  }, [isOpen]);

  const handleSelect = (selectedValue: string) => {
    onSelect(selectedValue);
    onToggle();
  };

  const handleTriggerLayout = () => {
    if (isOpen) {
      triggerRef.current?.measureInWindow((winX, winY, winWidth, winHeight) => {
        setTriggerLayout({
          x: winX,
          y: winY,
          width: winWidth,
          height: winHeight,
        });
      });
    }
  };

  const screenHeight = Dimensions.get("window").height;
  const dropdownTop = triggerLayout.y + triggerLayout.height + 8;
  const spaceBelow = screenHeight - dropdownTop;
  const maxHeight = Math.min(DROPDOWN_HEIGHT, Math.max(200, spaceBelow - 20));

  return (
    <View style={styles.container}>
      <View ref={triggerRef} collapsable={false} onLayout={handleTriggerLayout}>
        <Text className="text-sm font-medium mb-1 text-gray-900">{label}</Text>
        <Pressable
          className={`border rounded-xl px-4 py-3 flex-row items-center justify-between bg-white ${
            error ? "border-red-500" : "border-gray-200"
          }`}
          onPress={onToggle}
          style={styles.trigger}
        >
          <Text
            className={value ? "text-black" : "text-gray-400"}
            numberOfLines={1}
          >
            {value || placeholder}
          </Text>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={18}
            color="#6B7280"
          />
        </Pressable>
      </View>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="none"
        onRequestClose={onToggle}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onToggle}
        >
          <View
            style={[
              styles.dropdownContainer,
              {
                top: dropdownTop,
                left: triggerLayout.x,
                width: triggerLayout.width,
                maxHeight: maxHeight,
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            <ScrollView
              ref={scrollViewRef}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
              bounces={false}
              scrollEnabled={options.length * OPTION_HEIGHT > maxHeight}
              keyboardShouldPersistTaps="handled"
            >
              {options.map((option, index) => {
                const isSelected = option === value;
                return (
                  <TouchableOpacity
                    key={`${option}-${index}`}
                    style={[
                      styles.option,
                      index < options.length - 1 && styles.optionBorder,
                      isSelected && styles.selectedOption,
                    ]}
                    onPress={() => handleSelect(option)}
                    activeOpacity={0.6}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}
                    >
                      {option}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={18} color="#D65E48" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
  },
  trigger: {
    minHeight: 48,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  dropdownContainer: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
    overflow: "hidden",
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingVertical: 0,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: OPTION_HEIGHT,
    backgroundColor: "white",
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  selectedOption: {
    backgroundColor: "#FEF2F2",
  },
  optionText: {
    fontSize: 15,
    color: "#111827",
    flex: 1,
  },
  selectedOptionText: {
    color: "#D65E48",
    fontWeight: "500",
  },
});
