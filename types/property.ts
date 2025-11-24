export interface PropertyPhoto {
  id: string;
  propertyId: string;
  url: string;
  order: number;
  createdAt: any;
}

export interface Owner {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  profilePhoto: string | null;
}

export interface Property {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  areaM2: string;
  price: string;
  latitude?: number | null;
  longitude?: number | null;
  operationType: string | { id: string; name: string } | null;
  status: string;
  createdAt: any;
  updatedAt: any;
  propertyPhotos: PropertyPhoto[];
  operationTypeId?: string | null;
  propertyTypeId?: string | null;
  paymentId?: string | null;
  provinceId?: string | null;
  propertyType?: { id: string; name: string } | null;
  payment?: { id: string; name: string } | null;
  province?: { id: string; name: string } | null;
}

export interface PropertyDetail extends Property {
  owner: Owner;
}

export type UserProperty = Property;

export type OperationType = "RENT" | "SALE" | "ANTICRETICO";
export type PropertyStatus = "available" | "rented" | "sold" | "unavailable";
