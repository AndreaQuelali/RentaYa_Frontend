import { useState } from "react";
import { TextInput, Pressable, type TextInputProps, View, Text } from "react-native";
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";

interface FormFieldProps<T extends FieldValues> extends Omit<TextInputProps, 'value' | 'onChangeText'> {
    name: FieldPath<T>;
    control: Control<T>;
    label: string;
    isPassword?: boolean;
    error?: string;
}

export function FormField<T extends FieldValues>({
    name,
    control,
    label,
    isPassword = false,
    error,
    ...textInputProps
}: FormFieldProps<T>) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View className="space-y-2">
            <Text className="text-gray-700 font-medium text-base">{label}</Text>
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                    <View className={`flex-row items-center border rounded-xl bg-gray-50 ${error ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`}>
                        <TextInput
                            className="flex-1 px-4 py-4 text-base text-gray-900 bg-transparent"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            secureTextEntry={isPassword && !showPassword}
                            placeholderTextColor="#9CA3AF"
                            {...textInputProps}
                        />
                        {isPassword && (
                            <Pressable 
                                onPress={() => setShowPassword(prev => !prev)} 
                                className="p-3"
                            >
                                <Ionicons 
                                    name={showPassword ? 'eye-off' : 'eye'} 
                                    size={20} 
                                    color="#6B7280" 
                                />
                            </Pressable>
                        )}
                    </View>
                )}
            />
            {error && (
                <Text className="text-red-500 text-sm mt-1">
                    {error}
                </Text>
            )}
        </View>
    );
}