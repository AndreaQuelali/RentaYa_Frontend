import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Logo from '@/assets/logo';


export default function RegisterScreen() {
  const [show, setShow] = useState(false);
  const [names, setNames] = useState('');
  const [lastnames, setLastnames] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState<{
    names?: string;
    lastnames?: string;
    email?: string;
    password?: string;
  }>({});

  // Validators
  const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,30}$/;
  const emailRegex = /^[\w.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const validateNames = (value: string) => {
    const v = value.trim();
    if (!v) return 'El campo Nombres es obligatorio.';
    if (!nameRegex.test(v)) return 'Solo se permiten letras y espacios.';
    return undefined;
  };

  const validateLastnames = (value: string) => {
    const v = value.trim();
    if (!v) return 'El campo Apellidos es obligatorio.';
    if (!nameRegex.test(v)) return 'Solo se permiten letras y espacios.';
    return undefined;
  };

  const validateEmail = (value: string) => {
    const v = value.trim();
    if (!v) return 'El campo Correo electrónico es obligatorio.';
    if (!emailRegex.test(v)) return 'Correo electrónico no válido';
    return undefined;
  };

  const validatePassword = (value: string) => {
    if (!value) return 'El campo Contraseña es obligatorio.';
    if (!passwordRegex.test(value)) return 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúscula, minúscula y número';
    return undefined;
  };

  // Placeholder: replace with real API call to check if email is already registered
  const checkEmailExists = async (emailToCheck: string): Promise<boolean> => {
    // Conectar con el backend. 
    return false;
  };

  const handleRegister = async () => {
    const newErrors: typeof errors = {
      names: validateNames(names),
      lastnames: validateLastnames(lastnames),
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    try {
      const exists = await checkEmailExists(email.trim());
      if (exists) {
        setErrors((prev) => ({ ...prev, email: 'El correo electrónico ya está en uso' }));
        return;
      }
    } catch (e) {
      // Optional: manejar error de red
    }
    router.push('verify' as any);
  };

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
            <Logo/>
            <Text className="text-3xl font-medium tracking-tight text-white mt-3">RentaYa</Text>
          </View>
      

        <View className="bg-white rounded-t-2xl border border-gray-200 px-5 pt-12 pb-20 w-screen">
          <Text className="text-xl font-semibold text-center mb-4">Registro de usuario</Text>

          <View className="gap-3">
            <View className="gap-2">
              <Text className="text-sm font-medium">Nombres</Text>
              <TextInput
                placeholder="Escribe aquí"
                className="border border-gray-200 rounded-xl px-4 py-3"
                value={names}
                onChangeText={(t) => {
                  setNames(t);
                  if (errors.names) setErrors((prev) => ({ ...prev, names: undefined }));
                }}
                onBlur={() => setErrors((prev) => ({ ...prev, names: validateNames(names) }))}
              />
              {errors.names ? (
                <Text className="text-red-500 text-xs">{errors.names}</Text>
              ) : null}
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium">Apellidos</Text>
              <TextInput
                placeholder="Escribe aquí"
                className="border border-gray-200 rounded-xl px-4 py-3"
                value={lastnames}
                onChangeText={(t) => {
                  setLastnames(t);
                  if (errors.lastnames) setErrors((prev) => ({ ...prev, lastnames: undefined }));
                }}
                onBlur={() => setErrors((prev) => ({ ...prev, lastnames: validateLastnames(lastnames) }))}
              />
              {errors.lastnames ? (
                <Text className="text-red-500 text-xs">{errors.lastnames}</Text>
              ) : null}
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium">Correo electrónico</Text>
              <TextInput
                placeholder="Escribe aquí"
                keyboardType="email-address"
                autoCapitalize="none"
                className="border border-gray-200 rounded-xl px-4 py-3"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                onBlur={() => setErrors((prev) => ({ ...prev, email: validateEmail(email) }))}
              />
              {errors.email ? (
                <Text className="text-red-500 text-xs">{errors.email}</Text>
              ) : null}
            </View>

            <View className="gap-2">
              <Text className="text-sm font-medium">Contraseña</Text>
              <View className="flex-row items-center border border-gray-200 rounded-xl px-2">
                <TextInput
                  placeholder="Escribe aquí"
                  secureTextEntry={!show}
                  className="flex-1 px-2 py-3"
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  onBlur={() => setErrors((prev) => ({ ...prev, password: validatePassword(password) }))}
                />
                <Pressable onPress={() => setShow((s: boolean) => !s)} className="p-2">
                  <Ionicons name={show ? 'eye' : 'eye-off'} size={20} />
                </Pressable>
              </View>
              {errors.password ? (
                <Text className="text-red-500 text-xs">{errors.password}</Text>
              ) : null}
            </View>
          </View>

          <Pressable className="bg-black rounded-xl py-4 items-center mt-6" onPress={handleRegister}>
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

