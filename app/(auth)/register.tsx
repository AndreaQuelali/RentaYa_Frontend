import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import Logo from '@/assets/logo';
import { useRegisterForm } from '@/hooks/auth/use-register-form';
import { FormField } from '@/components/forms/form';

export default function RegisterScreen() {
  const { form, onSubmit, isLoading } = useRegisterForm();
  const { control, handleSubmit, formState: { errors } } = form;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-primary"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-primary justify-end">
          <View className=" items-center justify-center my-auto">
            <Logo />
            <Text className="text-3xl font-medium tracking-tight text-white mt-3">RentaYa</Text>
          </View>


          <View className="bg-white rounded-t-2xl border border-gray-200 px-5 pt-12 pb-20 w-screen">
            <Text className="text-xl font-semibold text-center mb-4">Registro de usuario</Text>

            <View className="gap-3">
              <FormField
                name="nombreCompleto"
                control={control}
                label="Nombre completo"
                placeholder='Escribe aquí'
                error={errors.nombreCompleto?.message}
              />
              <FormField
                name="telefono"
                control={control}
                label="Teléfono"
                placeholder='Escribe aquí'
                error={errors.telefono?.message}
              />
              <FormField
                name="correoElectronico"
                control={control}
                label="Correo electrónico"
                placeholder='example@gmail.com'
                error={errors.correoElectronico?.message}
              />
              <FormField
                name="contrasena"
                control={control}
                label="Contraseña"
                placeholder='******'
                isPassword
                error={errors.contrasena?.message}
              />
            </View>

            <Pressable
              className="bg-black rounded-xl py-4 items-center mt-6"
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}>
              <Text className="text-white font-semibold">Registrar</Text>
            </Pressable>
            <View className="items-center mt-5">
              <Text className="text-gray-500 text-sm">¿Ya tienes cuenta?</Text>
              <Link href="/(auth)/login" asChild>
                <Pressable>
                  <Text className="font-semibold text-secondary">Inicia sesión</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

