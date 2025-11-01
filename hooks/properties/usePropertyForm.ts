import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { api } from "@/lib/api";
import { UserProperty } from "@/types/property";

interface PropertyFormData {
  title: string;
  city: string;
  type: string;
  price: string;
  dealMode: string;
  description: string;
  address: string;
  area: string;
  photos: string[];
}

interface UsePropertyFormProps {
  propertyToEdit?: UserProperty | null;
  onSuccess?: () => void;
}

const OPERATION_TYPE_MAP: { [key: string]: string } = {
  rent: "Alquiler",
  sale: "Venta",
  both: "Anticrético",
  RENT: "Alquiler",
  SALE: "Venta",
  ANTICRETICO: "Anticrético",
};

const normalizeDealMode = (mode: string): string => {
  const m = mode.toLowerCase();
  if (m.startsWith("alquiler") || m === "rent") return "rent";
  if (m.startsWith("venta") || m === "sale") return "sale";
  if (
    m.normalize("NFD").replace(/\p{Diacritic}/gu, "") === "anticretico" ||
    m === "anticretico" ||
    m === "both"
  )
    return "both";
  return "";
};

export const usePropertyForm = ({
  propertyToEdit,
  onSuccess,
}: UsePropertyFormProps) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    city: "",
    type: "",
    price: "",
    dealMode: "",
    description: "",
    address: "",
    area: "",
    photos: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [originalPhotos, setOriginalPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (propertyToEdit) {
      const photos = propertyToEdit.propertyPhotos?.map((p) => p.url) || [];
      setFormData({
        title: propertyToEdit.title,
        city: propertyToEdit.city || "",
        type: "",
        price: propertyToEdit.price,
        dealMode:
          OPERATION_TYPE_MAP[propertyToEdit.operationType] || "Alquiler",
        description: propertyToEdit.description || "",
        address: propertyToEdit.address,
        area: propertyToEdit.areaM2 || "",
        photos: photos,
      });
      setOriginalPhotos(photos);
    }
  }, [propertyToEdit]);

  const updateField = <K extends keyof PropertyFormData>(
    field: K,
    value: PropertyFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      Alert.alert("Falta título", "Por favor ingresa un título");
      return false;
    }

    if (!formData.price || isNaN(Number(formData.price))) {
      Alert.alert("Precio inválido", "Ingresa un precio numérico");
      return false;
    }

    const tipoOperacion = normalizeDealMode(formData.dealMode);
    if (!tipoOperacion) {
      Alert.alert(
        "Modalidad inválida",
        "Selecciona Alquiler, Venta o Anticrético",
      );
      return false;
    }

    if (!formData.address.trim()) {
      Alert.alert("Falta dirección", "Por favor ingresa una dirección");
      return false;
    }

    return true;
  };

  const resetForm = () => {
    setFormData({
      title: "",
      city: "",
      type: "",
      price: "",
      dealMode: "",
      description: "",
      address: "",
      area: "",
      photos: [],
    });
    setOriginalPhotos([]);
  };

  const submitForm = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const tipoOperacion = normalizeDealMode(formData.dealMode);

      setSubmitting(true);

      if (propertyToEdit) {
        const areaM2 = formData.area
          ? Number(formData.area)
          : propertyToEdit?.areaM2
            ? Number(propertyToEdit.areaM2)
            : 50;

        const payload: any = {
          title: formData.title.trim(),
          description: formData.description?.trim() || undefined,
          address: formData.address.trim(),
          city: formData.city?.trim() || undefined,
          bedrooms: propertyToEdit?.bedrooms || 1,
          bathrooms: propertyToEdit?.bathrooms || 1,
          areaM2: areaM2,
          price: Number(formData.price),
          operationType: tipoOperacion,
        };

        const currentPhotos = formData.photos || [];
        const photosToRemove = originalPhotos.filter(
          (url) => !currentPhotos.includes(url),
        );
        const photosToAdd = currentPhotos.filter(
          (url) => !originalPhotos.includes(url),
        );

        if (photosToRemove.length > 0) {
          payload.photosToRemove = photosToRemove;
        }

        if (photosToAdd.length > 0) {
          payload.photosToAdd = photosToAdd;
        }

        await api.put(`/api/properties/${propertyToEdit.id}`, payload);
      } else {
        const formDataToSend = new FormData();

        formDataToSend.append("title", formData.title.trim());

        if (formData.description?.trim()) {
          formDataToSend.append("description", formData.description.trim());
        }

        formDataToSend.append("address", formData.address.trim());

        if (formData.city?.trim()) {
          formDataToSend.append("city", formData.city.trim());
        }

        const bedrooms = 1;
        formDataToSend.append("bedrooms", bedrooms.toString());

        const bathrooms = 1;
        formDataToSend.append("bathrooms", bathrooms.toString());

        const areaM2 = formData.area ? Number(formData.area) : 50;
        formDataToSend.append("areaM2", areaM2.toString());

        formDataToSend.append("price", formData.price);
        formDataToSend.append("operationType", tipoOperacion);

        if (formData.photos && formData.photos.length > 0) {
          formData.photos.forEach((photoUrl, index) => {
            formDataToSend.append(`photos[${index}]`, photoUrl);
          });
        }

        await api.post("/api/properties", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      Alert.alert(
        "Éxito",
        propertyToEdit
          ? "Propiedad actualizada correctamente"
          : "Propiedad publicada correctamente",
      );

      resetForm();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting property:", error);
      console.error("Error response:", error?.response?.data);

      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "No se pudo publicar. Intenta nuevamente.";

      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMsg = Array.isArray(errors)
          ? errors.map((e: any) => e.message || e).join("\n")
          : JSON.stringify(errors);
        Alert.alert("Error de validación", errorMsg);
      } else {
        Alert.alert("Error", msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    updateField,
    submitting,
    submitForm,
  };
};
