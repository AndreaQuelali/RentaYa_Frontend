import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

interface LocationPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (lat: number, lng: number) => void;
  initialLatitude?: number;
  initialLongitude?: number;
  address?: string;
  city?: string;
}

export default function LocationPicker({
  visible,
  onClose,
  onSelect,
  initialLatitude,
  initialLongitude,
  address,
  city,
}: LocationPickerProps) {
  // Centro de Cochabamba por defecto
  const defaultLat = -17.3895;
  const defaultLng = -66.1568;

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: initialLatitude || defaultLat,
    longitude: initialLongitude || defaultLng,
  });

  const [region, setRegion] = useState<Region>({
    latitude: initialLatitude || defaultLat,
    longitude: initialLongitude || defaultLng,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    setRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const handleConfirm = () => {
    onSelect(selectedLocation.latitude, selectedLocation.longitude);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#11181C" />
          </Pressable>
          <Text style={styles.title}>Seleccionar ubicación</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Mapa */}
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={region}
            onPress={handleMapPress}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            <Marker
              coordinate={selectedLocation}
              draggable
              onDragEnd={(e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                setSelectedLocation({ latitude, longitude });
              }}
            />
          </MapView>
        </View>

        {/* Información */}
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Ionicons name="location" size={20} color="#D65E48" />
            <View style={styles.infoText}>
              <Text style={styles.addressText}>
                {address || "Dirección no especificada"}
              </Text>
              {city && <Text style={styles.cityText}>{city}</Text>}
            </View>
          </View>

          <View style={styles.coordinatesBox}>
            <Text style={styles.coordinatesLabel}>Coordenadas:</Text>
            <Text style={styles.coordinatesText}>
              {selectedLocation.latitude.toFixed(6)},{" "}
              {selectedLocation.longitude.toFixed(6)}
            </Text>
          </View>
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <Pressable
            style={[styles.button, styles.cancelButton]}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.confirmButton]}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Confirmar ubicación</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#11181C",
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#11181C",
  },
  cityText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  coordinatesBox: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
  },
  coordinatesLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 13,
    fontFamily: "monospace",
    color: "#11181C",
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  confirmButton: {
    backgroundColor: "#11181C",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

