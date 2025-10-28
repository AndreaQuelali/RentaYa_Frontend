import { api } from "../api";

export interface CreateInmuebleData {
  title: string;
  description?: string;
  address: string;
  city: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaM2?: number;
  price: number;
  operationType: "alquiler" | "anticretico";
  photos?: string[];
}

export interface Inmueble {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  address?: string;
  city: string;
  propertyType?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaM2?: string;
  price: string;
  operationType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  propertyPhotos: {
    id: number;
    propertyId: string;
    url: string;
    order?: number;
    createdAt: string;
  }[];
}

export interface ListInmueblesResponse {
  items: Inmueble[];
  total: number;
}

export const inmuebleService = {
  /**
   * Crear un nuevo inmueble
   */
  async createInmueble(data: CreateInmuebleData) {
    const response = await api.post("/api/inmuebles", data);
    return response.data;
  },

  /**
   * Listar todos los inmuebles (público - para pantalla de inicio)
   */
  async listInmuebles(): Promise<ListInmueblesResponse> {
    const response = await api.get<{
      success: boolean;
      data: ListInmueblesResponse;
      message: string;
    }>("/api/inmuebles");
    return response.data.data;
  },

  /**
   * Listar solo mis inmuebles (requiere autenticación - para pantalla de propiedades)
   */
  async listMyInmuebles(): Promise<ListInmueblesResponse> {
    const response = await api.get<{
      success: boolean;
      data: ListInmueblesResponse;
      message: string;
    }>("/api/inmuebles/my-properties");
    return response.data.data;
  },

  /**
   * Subir imágenes a Cloudinary (si tienes configurado)
   */
  async uploadImages(images: string[]): Promise<string[]> {
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary no está configurado");
    }

    const uploadPromises = images.map(async (imageUri) => {
      const formData = new FormData();

      // Crear el archivo desde la URI
      const filename = imageUri.split("/").pop() || "image.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("file", {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "rentaya_properties");

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error?.message || "Error al subir imagen");
        }

        return data.secure_url;
      } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  },
};
