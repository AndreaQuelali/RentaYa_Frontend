import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link } from "expo-router";
import Logo from "@/assets/logo";
import { useRegisterForm } from "@/hooks/auth/use-register-form";
import { FormField } from "@/components/forms/form";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";

export default function RegisterScreen() {
  const { form, onSubmit, isLoading } = useRegisterForm();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = form;
  const selectedRole = watch("role");
  const [showRoleSelection, setShowRoleSelection] = useState(true);
  const [currentRole, setCurrentRole] = useState<
    "rentante" | "arrendador" | undefined
  >(selectedRole);

  useEffect(() => {
    const role = getValues("role");
    if (role) {
      setCurrentRole(role as "rentante" | "arrendador");
    }
  }, [selectedRole, getValues]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-primary"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-primary justify-end">
          <View className=" items-center justify-center my-auto">
            <Logo />
            <Text className="text-3xl font-medium tracking-tight text-white mt-3">
              RentaYa
            </Text>
          </View>

          <View className="bg-white rounded-t-2xl border border-gray-200 px-5 pt-12 pb-20 w-screen">
            {showRoleSelection ? (
              <>
                <Text className="text-2xl font-bold text-center mb-2">
                  ¿Cómo quieres usar RentaYa?
                </Text>
                <Text className="text-gray-600 text-center mb-8">
                  Selecciona el tipo de cuenta que mejor se adapte a ti
                </Text>

                <View className="gap-4 mb-6">
                  <Pressable
                    onPress={() => {
                      setValue("role", "rentante", {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setCurrentRole("rentante");
                      setShowRoleSelection(false);
                    }}
                    className={`border-2 rounded-2xl p-6 ${selectedRole === "rentante" ? "border-primary bg-primary/5" : "border-gray-200 bg-white"}`}
                  >
                    <View className="flex-row items-center gap-4">
                      <View
                        className={`w-14 h-14 rounded-full items-center justify-center ${selectedRole === "rentante" ? "bg-primary" : "bg-gray-100"}`}
                      >
                        <Ionicons
                          name="search-outline"
                          size={28}
                          color={
                            selectedRole === "rentante" ? "#fff" : "#6B7280"
                          }
                        />
                      </View>
                      <View className="flex-1">
                        <Text
                          className={`text-xl font-bold mb-1 ${selectedRole === "rentante" ? "text-primary" : "text-gray-900"}`}
                        >
                          Rentante
                        </Text>
                        <Text className="text-gray-600 text-sm">
                          Busco propiedades para alquilar o comprar
                        </Text>
                      </View>
                      {selectedRole === "rentante" && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color="#D65E48"
                        />
                      )}
                    </View>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      setValue("role", "arrendador", {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                      setCurrentRole("arrendador");
                      setShowRoleSelection(false);
                    }}
                    className={`border-2 rounded-2xl p-6 ${selectedRole === "arrendador" ? "border-primary bg-primary/5" : "border-gray-200 bg-white"}`}
                  >
                    <View className="flex-row items-center gap-4">
                      <View
                        className={`w-14 h-14 rounded-full items-center justify-center ${selectedRole === "arrendador" ? "bg-primary" : "bg-gray-100"}`}
                      >
                        <Ionicons
                          name="home-outline"
                          size={28}
                          color={
                            selectedRole === "arrendador" ? "#fff" : "#6B7280"
                          }
                        />
                      </View>
                      <View className="flex-1">
                        <Text
                          className={`text-xl font-bold mb-1 ${selectedRole === "arrendador" ? "text-primary" : "text-gray-900"}`}
                        >
                          Arrendador
                        </Text>
                        <Text className="text-gray-600 text-sm">
                          Tengo propiedades para publicar y administrar
                        </Text>
                      </View>
                      {selectedRole === "arrendador" && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color="#D65E48"
                        />
                      )}
                    </View>
                  </Pressable>
                </View>

                {selectedRole && (
                  <Pressable
                    className="bg-black rounded-xl py-4 items-center"
                    onPress={() => setShowRoleSelection(false)}
                  >
                    <Text className="text-white font-semibold">Continuar</Text>
                  </Pressable>
                )}
              </>
            ) : (
              <>
                <View className="flex-row items-center justify-between mb-6">
                  <Pressable onPress={() => setShowRoleSelection(true)}>
                    <Ionicons name="arrow-back" size={24} color="#11181C" />
                  </Pressable>
                  <Text className="text-xl font-semibold">
                    Completa tu información
                  </Text>
                  <View style={{ width: 24 }} />
                </View>

                <View className="mb-4">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Ionicons
                      name={currentRole === "rentante" ? "search" : "home"}
                      size={18}
                      color="#D65E48"
                    />
                    <Text className="text-primary font-semibold">
                      {currentRole === "rentante" ? "Rentante" : "Arrendador"}
                    </Text>
                  </View>
                </View>

                <View className="gap-3">
                  <FormField
                    name="fullName"
                    control={control}
                    label="Nombre completo"
                    placeholder="Escribe aquí"
                    error={errors.fullName?.message}
                  />
                  <FormField
                    name="phone"
                    control={control}
                    label="Teléfono"
                    placeholder="Escribe aquí"
                    error={errors.phone?.message}
                  />
                  <FormField
                    name="email"
                    control={control}
                    label="Correo electrónico"
                    placeholder="example@gmail.com"
                    error={errors.email?.message}
                  />
                  <FormField
                    name="password"
                    control={control}
                    label="Contraseña"
                    placeholder="******"
                    isPassword
                    error={errors.password?.message}
                  />
                </View>

                <Pressable
                  className="bg-black rounded-xl py-4 items-center mt-6"
                  onPress={handleSubmit(onSubmit)}
                  disabled={isLoading}
                >
                  <Text className="text-white font-semibold">Registrar</Text>
                </Pressable>
                <View className="items-center mt-5">
                  <Text className="text-gray-500 text-sm">
                    ¿Ya tienes cuenta?
                  </Text>
                  <Link href="/(auth)/login" asChild>
                    <Pressable>
                      <Text className="font-semibold text-secondary">
                        Inicia sesión
                      </Text>
                    </Pressable>
                  </Link>
                </View>
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
