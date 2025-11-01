export const translateStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    available: "Disponible",
    AVAILABLE: "Disponible",
    rented: "Alquilado",
    RENTED: "Alquilado",
    sold: "Vendido",
    SOLD: "Vendido",
    unavailable: "No disponible",
    UNAVAILABLE: "No disponible",
  };

  return statusMap[status] || status;
};

export const getOperationTypeLabel = (operationType: string): string => {
  const labels: { [key: string]: string } = {
    rent: "Alquiler",
    sale: "Venta",
    both: "Anticrético",
    RENT: "Alquiler",
    SALE: "Venta",
    ANTICRETICO: "Anticrético",
    anticretico: "Anticrético",
  };
  return labels[operationType] || operationType;
};

export const getOperationTypeSuffix = (operationType: string): string => {
  const op = operationType.toLowerCase();
  if (op === "rent" || op === "both" || op === "anticretico") {
    return "por mes";
  }
  return "precio de venta";
};

export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return `Bs ${numPrice.toLocaleString("es-BO")}`;
};

export const isPropertyAvailable = (status: string): boolean => {
  return (
    status.toLowerCase() === "available" ||
    status.toLowerCase() === "disponible"
  );
};

export const getStatusColorClasses = (
  status: string,
): {
  containerClass: string;
  textClass: string;
} => {
  const isAvailable = isPropertyAvailable(status);

  return {
    containerClass: isAvailable ? "bg-green-100" : "bg-red-100",
    textClass: isAvailable ? "text-green-700" : "text-red-700",
  };
};
