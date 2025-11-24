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
  latitude?: number;
  longitude?: number;
  paymentType?: string;
}

interface CatalogData {
  propertyTypes?: { id: string; name: string }[];
  operationTypes?: { id: string; name: string }[];
  provinces?: { id: string; name: string }[];
  paymentTypes?: { id: string; name: string }[];
}

interface UsePropertyFormProps {
  propertyToEdit?: UserProperty | null;
  onSuccess?: () => void;
  catalogs?: CatalogData;
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
  catalogs,
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
    latitude: undefined,
    longitude: undefined,
    paymentType: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [originalPhotos, setOriginalPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (propertyToEdit && catalogs) {
      const photos = propertyToEdit.propertyPhotos?.map((p) => p.url) || [];

      // Obtener nombres de los catálogos usando IDs o relaciones
      const propertyTypeName =
        propertyToEdit.propertyType?.name ||
        (propertyToEdit.propertyTypeId && catalogs.propertyTypes
          ? catalogs.propertyTypes.find(
              (pt) => pt.id === propertyToEdit.propertyTypeId
            )?.name || ""
          : "");

      // Obtener nombre del tipo de operación
      let operationTypeName = "";
      if (propertyToEdit.operationType) {
        if (
          typeof propertyToEdit.operationType === "object" &&
          propertyToEdit.operationType !== null
        ) {
          operationTypeName = propertyToEdit.operationType.name;
        } else if (typeof propertyToEdit.operationType === "string") {
          operationTypeName =
            OPERATION_TYPE_MAP[propertyToEdit.operationType] || "";
        }
      }
      // Si no se encontró, buscar por ID en catálogos
      if (
        !operationTypeName &&
        propertyToEdit.operationTypeId &&
        catalogs.operationTypes
      ) {
        operationTypeName =
          catalogs.operationTypes.find(
            (ot) => ot.id === propertyToEdit.operationTypeId
          )?.name || "";
      }

      const provinceName =
        propertyToEdit.province?.name ||
        (propertyToEdit.provinceId && catalogs.provinces
          ? catalogs.provinces.find((p) => p.id === propertyToEdit.provinceId)
              ?.name || ""
          : propertyToEdit.city || "");

      const paymentTypeName =
        propertyToEdit.payment?.name ||
        (propertyToEdit.paymentId && catalogs.paymentTypes
          ? catalogs.paymentTypes.find(
              (pt) => pt.id === propertyToEdit.paymentId
            )?.name || ""
          : "");

      // Manejar precio (puede ser string o Decimal de Prisma)
      const priceValue = propertyToEdit.price
        ? typeof propertyToEdit.price === "string"
          ? propertyToEdit.price
          : String(propertyToEdit.price)
        : "";

      // Manejar área (puede ser string o Decimal de Prisma)
      const areaValue = propertyToEdit.areaM2
        ? typeof propertyToEdit.areaM2 === "string"
          ? propertyToEdit.areaM2
          : String(propertyToEdit.areaM2)
        : "";

      setFormData({
        title: propertyToEdit.title || "",
        city: provinceName,
        type: propertyTypeName,
        price: priceValue,
        dealMode: operationTypeName,
        description: propertyToEdit.description || "",
        address: propertyToEdit.address || "",
        area: areaValue,
        photos: photos,
        latitude: propertyToEdit.latitude
          ? Number(propertyToEdit.latitude)
          : undefined,
        longitude: propertyToEdit.longitude
          ? Number(propertyToEdit.longitude)
          : undefined,
        paymentType: paymentTypeName,
      });
      setOriginalPhotos(photos);
    }
  }, [propertyToEdit, catalogs]);

  const updateField = <K extends keyof PropertyFormData>(
    field: K,
    value: PropertyFormData[K]
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
        "Selecciona Alquiler, Venta o Anticrético"
      );
      return false;
    }

    // Validar que haya coordenadas o dirección
    if (!formData.latitude || !formData.longitude) {
      if (!formData.address.trim()) {
        Alert.alert(
          "Falta ubicación",
          "Por favor selecciona una ubicación en el mapa"
        );
        return false;
      }
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
      latitude: undefined,
      longitude: undefined,
      paymentType: "",
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
          latitude: formData.latitude || null,
          longitude: formData.longitude || null,
        };

        // Convertir nombres a IDs si hay catálogos disponibles
        if (catalogs?.operationTypes && formData.dealMode) {
          const operationType = catalogs.operationTypes.find(
            (ot) => ot.name === formData.dealMode
          );
          if (operationType) {
            payload.operationTypeId = operationType.id;
          }
        } else {
          // Fallback al método anterior si no hay catálogos
          payload.operationType = tipoOperacion;
        }

        if (catalogs?.propertyTypes && formData.type) {
          const propertyType = catalogs.propertyTypes.find(
            (pt) => pt.name === formData.type
          );
          if (propertyType) {
            payload.propertyTypeId = propertyType.id;
          }
        }

        if (catalogs?.provinces && formData.city) {
          const province = catalogs.provinces.find(
            (p) => p.name === formData.city
          );
          if (province) {
            payload.provinceId = province.id;
          }
        }

        if (catalogs?.paymentTypes && formData.paymentType) {
          const paymentType = catalogs.paymentTypes.find(
            (pt) => pt.name === formData.paymentType
          );
          if (paymentType) {
            payload.paymentId = paymentType.id;
          }
        }

        const currentPhotos = formData.photos || [];
        const photosToRemove = originalPhotos.filter(
          (url) => !currentPhotos.includes(url)
        );
        const photosToAdd = currentPhotos.filter(
          (url) => !originalPhotos.includes(url)
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

        // Convertir nombres a IDs si hay catálogos disponibles
        if (catalogs?.operationTypes && formData.dealMode) {
          const operationType = catalogs.operationTypes.find(
            (ot) => ot.name === formData.dealMode
          );
          if (operationType) {
            formDataToSend.append("operationTypeId", operationType.id);
          }
        } else {
          // Fallback al método anterior si no hay catálogos
          formDataToSend.append("operationType", tipoOperacion);
        }

        if (catalogs?.propertyTypes && formData.type) {
          const propertyType = catalogs.propertyTypes.find(
            (pt) => pt.name === formData.type
          );
          if (propertyType) {
            formDataToSend.append("propertyTypeId", propertyType.id);
          }
        }

        if (catalogs?.provinces && formData.city) {
          const province = catalogs.provinces.find(
            (p) => p.name === formData.city
          );
          if (province) {
            formDataToSend.append("provinceId", province.id);
          }
        }

        if (catalogs?.paymentTypes && formData.paymentType) {
          const paymentType = catalogs.paymentTypes.find(
            (pt) => pt.name === formData.paymentType
          );
          if (paymentType) {
            formDataToSend.append("paymentId", paymentType.id);
          }
        }

        if (formData.latitude && formData.longitude) {
          formDataToSend.append("latitude", formData.latitude.toString());
          formDataToSend.append("longitude", formData.longitude.toString());
        }

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
          : "Propiedad publicada correctamente"
      );

      resetForm();

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Error submitting property:", error);
      console.error("Error response:", error?.response?.data);
      console.error("Error message:", error?.message);
      console.error("Error code:", error?.code);

      let msg = "No se pudo publicar. Intenta nuevamente.";

      // Si es un error de red, verificar si la propiedad se creó de todas formas
      if (
        error?.code === "ERR_NETWORK" ||
        error?.message?.includes("Network Error")
      ) {
        msg =
          "Error de conexión. La propiedad puede haberse creado. Verifica tus propiedades.";
      } else if (error?.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error?.response?.data?.error) {
        msg = error.response.data.error;
      } else if (error?.message) {
        msg = error.message;
      }

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
