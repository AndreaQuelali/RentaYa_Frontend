import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Link, useRouter } from "expo-router";
import Logo from "@/assets/logo";
import { FormField } from "@/components/forms/form";
import { useForgotPassword } from "@/hooks/auth/use-forgot-password";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email inválido").min(1, "El email es requerido"),
});

const resetPasswordSchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, "El código debe tener 6 dígitos")
    .min(1, "El código es requerido"),
  newPassword: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .min(1, "La contraseña es requerida"),
  confirmPassword: z
    .string()
    .min(1, "Debe confirmar la contraseña"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword, resetPassword } = useForgotPassword();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");

  // Form for email step
  const emailForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Form for code step
  const codeForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onEmailSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setEmail(data.email);
      await forgotPassword.mutateAsync(data.email);
      setStep("code");
    } catch (error) {
      console.error("Error in forgot password:", error);
    }
  };

  const onResetSubmit = async (data: ResetPasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      codeForm.setError("confirmPassword", {
        message: "Las contraseñas no coinciden",
      });
      return;
    }

    try {
      await resetPassword.mutateAsync({
        code: data.code,
        newPassword: data.newPassword,
      });
      // Redirect to login after successful reset
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error in reset password:", error);
    }
  };

  if (step === "email") {
    return (
      <SafeAreaView className="flex-1 bg-primary">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
             <View className="flex-1 bg-primary">
                <Pressable 
                  onPress={() => router.back()} 
                  className="absolute top-12 left-5 z-10 p-2"
                >
                  <Ionicons name="chevron-back" size={24} color="white" />
                </Pressable>
                <View className="items-center justify-center my-auto">
                  <Logo />
                  <Text className="text-3xl font-medium tracking-tight text-white mt-3">
                    RentaYa
                  </Text>
                </View>
            </View>
            <View className="bg-white rounded-t-3xl px-6 pt-8 pb-12 min-h-[400px]">
              <View className="mb-8">
                <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
                  Recuperar contraseña
                </Text>
                <Text className="text-gray-600 text-center text-sm">
                  Ingresa tu correo electrónico y te enviaremos un código para
                  recuperar tu contraseña
                </Text>
              </View>

              <View className="space-y-6">
                <FormField
                  name="email"
                  control={emailForm.control}
                  label="Correo electrónico"
                  placeholder="ejemplo@correo.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  error={emailForm.formState.errors.email?.message}
                />
              </View>

              <View className="mt-8 space-y-4">
                <Pressable
                  className={`rounded-xl py-4 items-center ${
                    forgotPassword.isPending ? "bg-black/70" : "bg-black"
                  }`}
                  onPress={emailForm.handleSubmit(onEmailSubmit)}
                  disabled={forgotPassword.isPending}
                >
                  {forgotPassword.isPending ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-semibold text-base">
                      Enviar código
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // Code and password reset step
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center items-center px-6 pt-12 pb-8">
            <Pressable
              onPress={() => {
                setStep("email");
                codeForm.reset();
              }}
              className="absolute top-6 left-6 z-10"
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </Pressable>

            <View className="items-center">
              <Logo />
              <Text className="text-4xl font-bold text-white mt-4 tracking-tight">
                RentaYa
              </Text>
              <Text className="text-white/80 text-base mt-2 text-center">
                Ingresa el código enviado
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-t-3xl px-6 pt-8 pb-12 min-h-[500px]">
            <View className="mb-8">
              <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
                Verificar correo
              </Text>
              <Text className="text-gray-600 text-center text-sm">
                Se ha enviado un código de 6 dígitos a {email}
              </Text>
            </View>

            <View className="space-y-6">
              <View>
                <Text className="text-gray-900 font-semibold mb-2">
                  Código de verificación
                </Text>
                <TextInput
                  placeholder="000000"
                  placeholderTextColor="#D1D5DB"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={codeForm.watch("code")}
                  onChangeText={(value) =>
                    codeForm.setValue("code", value.replace(/[^0-9]/g, ""))
                  }
                  className="border border-gray-300 rounded-lg px-4 py-3 text-lg font-mono tracking-widest text-center"
                />
                {codeForm.formState.errors.code && (
                  <Text className="text-red-500 text-xs mt-1">
                    {codeForm.formState.errors.code.message}
                  </Text>
                )}
              </View>

              <FormField
                name="newPassword"
                control={codeForm.control}
                label="Nueva contraseña"
                placeholder="Ingresa tu nueva contraseña"
                isPassword
                error={codeForm.formState.errors.newPassword?.message}
              />

              <FormField
                name="confirmPassword"
                control={codeForm.control}
                label="Confirmar contraseña"
                placeholder="Confirma tu nueva contraseña"
                isPassword
                error={codeForm.formState.errors.confirmPassword?.message}
              />
            </View>

            <View className="mt-8 space-y-4">
              <Pressable
                className={`rounded-xl py-4 items-center ${
                  resetPassword.isPending ? "bg-black/70" : "bg-black"
                }`}
                onPress={codeForm.handleSubmit(onResetSubmit)}
                disabled={resetPassword.isPending}
              >
                {resetPassword.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold text-base">
                    Restablecer contraseña
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={() => {
                  setStep("email");
                  codeForm.reset();
                }}
              >
                <Text className="text-gray-600 text-center font-medium">
                  Enviar otro código
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
