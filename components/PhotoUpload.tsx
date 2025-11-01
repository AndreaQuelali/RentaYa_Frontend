import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export interface PhotoUrlPickerProps {
  value: string[];
  onChange: (urls: string[]) => void;
  title?: string;
}

async function uploadToCloudinary(localUri: string): Promise<string> {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const unsignedPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !unsignedPreset) {
    throw new Error(
      "Faltan variables EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME o EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
    );
  }

  const uriParts = localUri.split(".");
  const fileType = uriParts[uriParts.length - 1];

  const formData: any = new FormData();
  formData.append("file", {
    // @ts-ignore RN FormData file
    uri: localUri,
    type: `image/${fileType}`,
    name: `upload.${fileType}`,
  });
  formData.append("upload_preset", String(unsignedPreset));

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
    {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error subiendo imagen: ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.secure_url as string;
}

export default function PhotoUrlPicker({
  value,
  onChange,
  title = "Fotos",
}: PhotoUrlPickerProps) {
  const [uploading, setUploading] = useState(false);

  const pickImages = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") {
      alert("Se requiere permiso para acceder a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 0.8,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      selectionLimit: 0,
      allowsMultipleSelection: true,
    });

    if (result.canceled) return;

    try {
      setUploading(true);
      const selected = (result.assets || []).map((a) => a.uri);
      const uploads = [] as Promise<string>[];
      for (const uri of selected) {
        uploads.push(uploadToCloudinary(uri));
      }
      const urls = await Promise.all(uploads);
      onChange([...(value || []), ...urls]);
    } catch (e: any) {
      alert(e?.message || "No se pudieron subir las imágenes");
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (idx: number) => {
    const next = [...value];
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <View className="gap-2">
      <Text className="text-sm font-medium mb-1">{title}</Text>

      <View className="border border-gray-200 rounded-xl px-4 py-4 items-center justify-center">
        <Ionicons name="cloud-upload-outline" size={28} color="#6B7280" />
        <Text className="text-gray-500 text-xs mt-2 text-center">
          Toca para seleccionar desde tu galería
        </Text>
        <Pressable
          className="mt-3 border border-gray-300 rounded-lg px-3 py-2"
          onPress={pickImages}
          disabled={uploading}
        >
          <Text>{uploading ? "Subiendo..." : "Seleccionar fotos"}</Text>
        </Pressable>
      </View>

      {uploading && (
        <View className="flex-row items-center gap-2 mt-2">
          <ActivityIndicator />
          <Text className="text-gray-500">Subiendo imágenes...</Text>
        </View>
      )}

      {value && value.length > 0 && (
        <FlatList
          className="mt-4"
          data={value}
          keyExtractor={(item, idx) => `${item}-${idx}`}
          horizontal
          ItemSeparatorComponent={() => <View className="w-3" />}
          renderItem={({ item, index }) => (
            <View className="relative">
              <Image
                source={{ uri: item }}
                style={{ width: 100, height: 100, borderRadius: 12 }}
              />
              <Pressable
                onPress={() => removeAt(index)}
                className="absolute -top-2 -right-2 bg-black/80 rounded-full p-1"
              >
                <Ionicons name="close" color="#fff" size={14} />
              </Pressable>
            </View>
          )}
        />
      )}
    </View>
  );
}
