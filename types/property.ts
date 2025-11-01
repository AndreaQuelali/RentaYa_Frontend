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
  operationType: string;
  status: string;
  createdAt: any;
  updatedAt: any;
  propertyPhotos: PropertyPhoto[];
}

export interface PropertyDetail extends Property {
  owner: Owner;
}

export type UserProperty = Property;

export type OperationType = "RENT" | "SALE" | "ANTICRETICO";
export type PropertyStatus = "available" | "rented" | "sold" | "unavailable";
