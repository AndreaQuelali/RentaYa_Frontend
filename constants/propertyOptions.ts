export const PROPERTY_TYPES = [
  "Casa",
  "Departamento",
  "Oficina",
  "Terreno",
  "Local comercial",
  "Garaje",
  "Parqueo",
  "Galpón",
] as const;

export const OPERATION_MODES = ["Alquiler", "Venta", "Anticrético"] as const;

export const PROPERTY_STATUS = {
  AVAILABLE: "available",
  RENTED: "rented",
  SOLD: "sold",
  UNAVAILABLE: "unavailable",
} as const;

export const OPERATION_TYPE_API = {
  RENT: "RENT",
  SALE: "SALE",
  ANTICRETICO: "ANTICRETICO",
} as const;

export type PropertyType = (typeof PROPERTY_TYPES)[number];
export type OperationMode = (typeof OPERATION_MODES)[number];
export type PropertyStatusValue =
  (typeof PROPERTY_STATUS)[keyof typeof PROPERTY_STATUS];
export type OperationTypeAPI =
  (typeof OPERATION_TYPE_API)[keyof typeof OPERATION_TYPE_API];
