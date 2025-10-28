import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { inmuebleService } from "@/lib/services/inmuebleService";

export interface PropertyFormData {
  title: string;
  address: string;
  city: string;
  bedrooms: string;
  bathrooms: string;
  areaM2: string;
  price: string;
  dealMode: string;
  description: string;
  images: string[];
}

export const usePropertyForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    address: "",
    city: "Cochabamba",
    bedrooms: "",
    bathrooms: "",
    areaM2: "",
    price: "",
    dealMode: "",
    description: "",
    images: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      Alert.alert("Error", "El título es obligatorio");
      return false;
    }
    if (!formData.address.trim()) {
      Alert.alert("Error", "La dirección es obligatoria");
      return false;
    }
    if (!formData.city.trim()) {
      Alert.alert("Error", "La ciudad es obligatoria");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      Alert.alert("Error", "El precio debe ser mayor a 0");
      return false;
    }
    if (!formData.dealMode) {
      Alert.alert("Error", "Debe seleccionar una modalidad");
      return false;
    }
    if (formData.images.length === 0) {
      Alert.alert("Error", "Debe agregar al menos una foto");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // 1. Subir imágenes a Cloudinary
      Alert.alert("Subiendo imágenes", "Por favor espere...");
      const uploadedUrls = await inmuebleService.uploadImages(formData.images);

      // 2. Crear el inmueble
      const data = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        address: formData.address.trim(),
        city: formData.city.trim(),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms
          ? parseInt(formData.bathrooms)
          : undefined,
        areaM2: formData.areaM2 ? parseFloat(formData.areaM2) : undefined,
        price: parseFloat(formData.price),
        operationType: formData.dealMode as "alquiler" | "anticretico",
        photos: uploadedUrls,
      };

      await inmuebleService.createInmueble(data);

      Alert.alert("Éxito", "Propiedad publicada correctamente", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error("Error al publicar:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error al publicar la propiedad";
      Alert.alert("Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = <K extends keyof PropertyFormData>(
    field: K,
    value: PropertyFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addImages = (newImages: string[]) => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      address: "",
      city: "Cochabamba",
      bedrooms: "",
      bathrooms: "",
      areaM2: "",
      price: "",
      dealMode: "",
      description: "",
      images: [],
    });
  };

  return {
    formData,
    isLoading,
    updateField,
    addImages,
    removeImage,
    handleSubmit,
    resetForm,
  };
};
