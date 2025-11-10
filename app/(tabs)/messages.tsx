import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Datos estáticos simulados de mensajes enviados
const MENSAJES_MOCK = [
  {
    id: "1",
    propertyId: "1",
    propertyTitle: "Departamento 2 dormitorios zona Norte",
    propertyImage: "https://via.placeholder.com/100",
    ownerName: "Juan Pérez",
    message:
      "¿Está disponible para visitar el departamento este fin de semana?",
    date: "2025-11-04T10:30:00",
    status: "enviado", // enviado, respondido
  },
  {
    id: "2",
    propertyId: "2",
    propertyTitle: "Casa amplia con jardín",
    propertyImage: "https://via.placeholder.com/100",
    ownerName: "María García",
    message:
      "Me interesa mucho la propiedad. ¿Cuál es el precio de alquiler mensual y qué servicios incluye?",
    date: "2025-11-03T15:20:00",
    status: "respondido",
  },
  {
    id: "3",
    propertyId: "3",
    propertyTitle: "Oficina en el centro de la ciudad",
    propertyImage: "https://via.placeholder.com/100",
    ownerName: "Carlos Rodríguez",
    message: "¿Acepta mascotas? Tengo un perro pequeño.",
    date: "2025-11-02T09:15:00",
    status: "respondido",
  },
  {
    id: "4",
    propertyId: "4",
    propertyTitle: "Loft moderno amoblado",
    propertyImage: "https://via.placeholder.com/100",
    ownerName: "Ana López",
    message:
      "Quisiera saber si es posible hacer una visita mañana por la tarde.",
    date: "2025-11-01T14:45:00",
    status: "enviado",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "respondido":
      return "bg-green-100 text-green-700";
    case "leído":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "respondido":
      return "Respondido";
    case "leído":
      return "Leído";
    default:
      return "Enviado";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return (
      "Hoy " +
      date.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" })
    );
  } else if (diffDays === 1) {
    return "Ayer";
  } else if (diffDays < 7) {
    return `Hace ${diffDays} días`;
  } else {
    return date.toLocaleDateString("es-BO", { day: "2-digit", month: "short" });
  }
};

export default function MessagesScreen() {
  const handleMessagePress = (propertyId: string) => {
    router.push(`/property/${propertyId}`);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 pt-12 pb-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold">Mensajes</Text>
        <Text className="text-sm text-gray-600 mt-1">
          {MENSAJES_MOCK.length} consultas enviadas
        </Text>
      </View>

      <ScrollView className="flex-1">
        {MENSAJES_MOCK.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="chatbubbles-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-600 mt-4">
              Tus mensajes aparecerán aquí
            </Text>
          </View>
        ) : (
          <View className="px-4 py-2">
            {MENSAJES_MOCK.map((mensaje, index) => (
              <Pressable
                key={mensaje.id}
                onPress={() => handleMessagePress(mensaje.propertyId)}
                className="bg-white border border-gray-200 rounded-xl p-4 mb-3"
              >
                {/* Header del mensaje */}
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text
                      className="text-base font-semibold text-gray-900"
                      numberOfLines={1}
                    >
                      {mensaje.propertyTitle}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Ionicons
                        name="person-circle-outline"
                        size={14}
                        color="#6b7280"
                      />
                      <Text className="text-sm text-gray-600 ml-1">
                        {mensaje.ownerName}
                      </Text>
                    </View>
                  </View>
                  <View
                    className={`px-2 py-1 rounded-full ${getStatusColor(mensaje.status)}`}
                  >
                    <Text className="text-xs font-medium">
                      {getStatusText(mensaje.status)}
                    </Text>
                  </View>
                </View>

                {/* Mensaje */}
                <View className="bg-gray-50 rounded-lg p-3 mb-2">
                  <Text className="text-sm text-gray-700" numberOfLines={2}>
                    {mensaje.message}
                  </Text>
                </View>

                {/* Footer */}
                <View className="flex-row justify-between items-center">
                  <Text className="text-xs text-gray-500">
                    {formatDate(mensaje.date)}
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-xs text-primary mr-1">
                      Ver propiedad
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={14}
                      color="#ff6b35"
                    />
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
