import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { Link,router } from 'expo-router';
import Logo from '@/assets/logo';
import { FormField } from '@/components/forms/form';
import { useLoginForm } from '@/hooks/auth/use-login-form';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const { form, onSubmit, isLoading } = useLoginForm();
  const { control, handleSubmit, formState: { errors } } = form;

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                Iniciar sesión
              </Text>
              <Text className="text-gray-600 text-center">
                Accede a tu cuenta para continuar
              </Text>
            </View>

            <View className="space-y-6">
              <FormField
                name="email"
                control={control}
                label="Correo electrónico"
                placeholder="ejemplo@correo.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email?.message}
              />

              <FormField
                name="password"
                control={control}
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                isPassword
                autoComplete="password"
                error={errors.password?.message}
              />

              <View className="items-end">
                <Link href="/(auth)/forgot-password" asChild>
                  <Pressable>
                    <Text className="text-primary font-medium text-sm">
                      ¿Olvidaste tu contraseña?
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>

            <View className="mt-8 space-y-4">
              <Pressable 
                className={`rounded-xl py-4 items-center ${isLoading ? 'bg-black/70' : 'bg-black'}`}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold text-base">
                    Iniciar sesión
                  </Text>
                )}
              </Pressable>
            </View>

            <View className="flex-row items-center justify-center mt-8">
              <Text className="text-gray-600 text-base">¿No tienes una cuenta? </Text>
              <Link href="/(auth)/register" asChild>
                <Pressable>
                  <Text className="font-semibold text-primary">Regístrate</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
