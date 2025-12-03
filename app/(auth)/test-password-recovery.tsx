import {
  View,
  Text,
  Pressable,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { api } from "@/lib/api";
import Logo from "@/assets/logo";

export default function TestPasswordRecoveryScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code">("email");
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev]);
  };

  const testForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor ingresa un email");
      return;
    }

    setLoading(true);
    addLog(`🚀 Iniciando solicitud de recuperación para: ${email}`);
    addLog(`📡 URL del backend: ${process.env.EXPO_PUBLIC_API_URL || "No configurada"}`);

    try {
      addLog(`⏳ Enviando petición POST a /api/auth/forgot-password...`);

      const response = await api.post("/api/auth/forgot-password", { email });

      addLog(`✅ Respuesta recibida con status: ${response.status}`);
      addLog(`📦 Data: ${JSON.stringify(response.data, null, 2)}`);

      Alert.alert(
        "Éxito",
        "Si el correo existe, se ha enviado el código de recuperación. Revisa tu bandeja de entrada.",
        [
          {
            text: "OK",
            onPress: () => setStep("code"),
          },
        ]
      );
    } catch (error: any) {
      addLog(`❌ Error capturado`);

      if (error.response) {
        addLog(`📛 Status HTTP: ${error.response.status}`);
        addLog(`📛 Data de error: ${JSON.stringify(error.response.data, null, 2)}`);
        addLog(`📛 Headers: ${JSON.stringify(error.response.headers, null, 2)}`);

        Alert.alert(
          "Error del servidor",
          `Status: ${error.response.status}\n${error.response.data?.message || "Error desconocido"}`
        );
      } else if (error.request) {
        addLog(`📛 No se recibió respuesta del servidor`);
        addLog(`📛 Request: ${JSON.stringify(error.request, null, 2)}`);

        Alert.alert(
          "Error de red",
          "No se pudo conectar con el servidor. Verifica:\n1. La URL del backend\n2. Tu conexión a internet\n3. Que el servidor esté activo"
        );
      } else {
        addLog(`📛 Error: ${error.message}`);
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const testResetPassword = async () => {
    if (!code || !newPassword) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    addLog(`🚀 Iniciando reset de contraseña con código: ${code}`);

    try {
      addLog(`⏳ Enviando petición POST a /api/auth/reset-password...`);

      const response = await api.post("/api/auth/reset-password", {
        code,
        newPassword,
      });

      addLog(`✅ Respuesta recibida con status: ${response.status}`);
      addLog(`📦 Data: ${JSON.stringify(response.data, null, 2)}`);

      Alert.alert(
        "Éxito",
        "Contraseña restablecida correctamente",
        [
          {
            text: "Ir al login",
            onPress: () => router.replace("/(auth)/login"),
          },
        ]
      );
    } catch (error: any) {
      addLog(`❌ Error capturado`);

      if (error.response) {
        addLog(`📛 Status HTTP: ${error.response.status}`);
        addLog(`📛 Data de error: ${JSON.stringify(error.response.data, null, 2)}`);

        Alert.alert(
          "Error del servidor",
          `Status: ${error.response.status}\n${error.response.data?.message || "Error desconocido"}`
        );
      } else if (error.request) {
        addLog(`📛 No se recibió respuesta del servidor`);

        Alert.alert(
          "Error de red",
          "No se pudo conectar con el servidor"
        );
      } else {
        addLog(`📛 Error: ${error.message}`);
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setLoading(true);
    addLog(`🔍 Probando conexión con el backend...`);
    addLog(`📡 URL: ${process.env.EXPO_PUBLIC_API_URL || "No configurada"}`);

    try {
      const response = await api.get("/api/health");
      addLog(`✅ Conexión exitosa! Status: ${response.status}`);
      addLog(`📦 Data: ${JSON.stringify(response.data, null, 2)}`);
      Alert.alert("Éxito", "Conexión con el backend establecida correctamente");
    } catch (error: any) {
      addLog(`❌ Error de conexión`);

      if (error.response) {
        addLog(`📛 Status: ${error.response.status}`);
        addLog(`📛 Data: ${JSON.stringify(error.response.data, null, 2)}`);
        Alert.alert("Error", `El servidor respondió con status ${error.response.status}`);
      } else if (error.request) {
        addLog(`📛 No hay respuesta del servidor`);
        Alert.alert(
          "Error de conexión",
          `No se pudo conectar con:\n${process.env.EXPO_PUBLIC_API_URL || "URL no configurada"}\n\nVerifica que el backend esté activo.`
        );
      } else {
        addLog(`📛 Error: ${error.message}`);
        Alert.alert("Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog("🧹 Logs limpiados");
  };

  if (step === "email") {
    return (
      <SafeAreaView className="flex-1 bg-primary">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pt-12 pb-8">
            <Pressable
              onPress={() => router.back()}
              className="mb-4"
            >
              <Text className="text-white text-2xl">←</Text>
            </Pressable>

            <View className="items-center mb-6">
              <Logo />
              <Text className="text-3xl font-bold text-white mt-4">
                Test de Recuperación
              </Text>
              <Text className="text-white/80 text-sm mt-2 text-center">
                Herramienta de debugging para recuperación de contraseña
              </Text>
            </View>

            <View className="bg-white rounded-xl p-6 mb-4">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Información del Backend
              </Text>
              <View className="bg-gray-100 p-3 rounded-lg mb-4">
                <Text className="text-xs font-mono text-gray-600 mb-1">
                  API URL:
                </Text>
                <Text className="text-xs font-mono text-gray-900 font-bold">
                  {process.env.EXPO_PUBLIC_API_URL || "❌ No configurada"}
                </Text>
              </View>

              <Pressable
                className="bg-blue-500 rounded-lg py-3 items-center mb-3"
                onPress={testConnection}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">
                    🔍 Probar Conexión
                  </Text>
                )}
              </Pressable>
            </View>

            <View className="bg-white rounded-xl p-6 mb-4">
              <Text className="text-lg font-bold text-gray-900 mb-4">
                Paso 1: Solicitar Código
              </Text>

              <View className="mb-4">
                <Text className="text-gray-700 font-semibold mb-2">
                  Correo electrónico
                </Text>
                <TextInput
                  placeholder="test@ejemplo.com"
                  placeholderTextColor="#D1D5DB"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  className="border border-gray-300 rounded-lg px-4 py-3 text-base"
                />
              </View>

              <Pressable
                className={`rounded-lg py-3 items-center ${
                  loading ? "bg-black/70" : "bg-black"
                }`}
                onPress={testForgotPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-semibold">
                    📧 Enviar Código de Recuperación
                  </Text>
                )}
              </Pressable>

              <Pressable
                className="mt-3 py-2"
                onPress={() => setStep("code")}
              >
                <Text className="text-blue-600 text-center font-medium">
                  Ya tengo un código →
                </Text>
              </Pressable>
            </View>

            {logs.length > 0 && (
              <View className="bg-gray-900 rounded-xl p-4">
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-white font-bold">Console Logs</Text>
                  <Pressable onPress={clearLogs}>
                    <Text className="text-red-400 text-sm">🧹 Limpiar</Text>
                  </Pressable>
                </View>
                <ScrollView
                  className="max-h-64"
                  showsVerticalScrollIndicator={true}
                >
                  {logs.map((log, index) => (
                    <Text
                      key={index}
                      className="text-green-400 text-xs font-mono mb-1"
                    >
                      {log}
                    </Text>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Code step
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-12 pb-8">
          <Pressable
            onPress={() => setStep("email")}
            className="mb-4"
          >
            <Text className="text-white text-2xl">←</Text>
          </Pressable>

          <View className="items-center mb-6">
            <Logo />
            <Text className="text-3xl font-bold text-white mt-4">
              Verificar Código
            </Text>
            <Text className="text-white/80 text-sm mt-2 text-center">
              Ingresa el código recibido por email
            </Text>
          </View>

          <View className="bg-white rounded-xl p-6 mb-4">
            <Text className="text-lg font-bold text-gray-900 mb-4">
              Paso 2: Restablecer Contraseña
            </Text>

            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">
                Código de 6 dígitos
              </Text>
              <TextInput
                placeholder="000000"
                placeholderTextColor="#D1D5DB"
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={(value) => setCode(value.replace(/[^0-9]/g, ""))}
                className="border border-gray-300 rounded-lg px-4 py-3 text-lg font-mono tracking-widest text-center"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">
                Nueva contraseña
              </Text>
              <TextInput
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#D1D5DB"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                className="border border-gray-300 rounded-lg px-4 py-3 text-base"
              />
            </View>

            <Pressable
              className={`rounded-lg py-3 items-center ${
                loading ? "bg-black/70" : "bg-black"
              }`}
              onPress={testResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold">
                  🔐 Restablecer Contraseña
                </Text>
              )}
            </Pressable>

            <Pressable
              className="mt-3 py-2"
              onPress={() => setStep("email")}
            >
              <Text className="text-blue-600 text-center font-medium">
                ← Solicitar nuevo código
              </Text>
            </Pressable>
          </View>

          {logs.length > 0 && (
            <View className="bg-gray-900 rounded-xl p-4">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white font-bold">Console Logs</Text>
                <Pressable onPress={clearLogs}>
                  <Text className="text-red-400 text-sm">🧹 Limpiar</Text>
                </Pressable>
              </View>
              <ScrollView
                className="max-h-64"
                showsVerticalScrollIndicator={true}
              >
                {logs.map((log, index) => (
                  <Text
                    key={index}
                    className="text-green-400 text-xs font-mono mb-1"
                  >
                    {log}
                  </Text>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
