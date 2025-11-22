export const formatDate = (
  dateInput: string | number | bigint | Date | null | undefined,
): string => {
  if (!dateInput) return "Fecha no disponible";

  try {
    let date: Date;
    if (typeof dateInput === "object" && !(dateInput instanceof Date)) {
      if (Object.keys(dateInput as any).length === 0) {
        return "Fecha no disponible";
      }

      const obj = dateInput as any;
      if (obj.timestamp) {
        return formatDate(obj.timestamp);
      } else if (obj.date) {
        return formatDate(obj.date);
      } else if (obj._seconds || obj.seconds) {
        const seconds = obj._seconds || obj.seconds;
        date = new Date(seconds * 1000);
      } else {
        return "Fecha no válida";
      }
    } else if (typeof dateInput === "string") {
      if (dateInput.trim() === "") {
        return "Fecha no disponible";
      }

      if (/^\d+$/.test(dateInput)) {
        const timestamp = parseInt(dateInput, 10);
        date = new Date(timestamp > 9999999999 ? timestamp : timestamp * 1000);
      } else {
        date = new Date(dateInput);
      }
    } else if (typeof dateInput === "number") {
      date = new Date(dateInput > 9999999999 ? dateInput : dateInput * 1000);
    } else if (typeof dateInput === "bigint") {
      const timestamp = Number(dateInput);
      date = new Date(timestamp > 9999999999 ? timestamp : timestamp * 1000);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      return "Fecha no válida";
    }

    if (isNaN(date.getTime())) {
      return "Fecha no válida";
    }

    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error, "Input:", dateInput);
    return "Fecha no válida";
  }
};

export const formatRelativeTime = (
  dateInput: string | number | bigint | Date | null | undefined,
): string => {
  if (!dateInput) return "Fecha no disponible";

  try {
    let date: Date;
    if (typeof dateInput === "object" && !(dateInput instanceof Date)) {
      if (Object.keys(dateInput as any).length === 0) {
        return "Fecha no disponible";
      }

      const obj = dateInput as any;
      if (obj.timestamp) {
        return formatRelativeTime(obj.timestamp);
      } else if (obj.date) {
        return formatRelativeTime(obj.date);
      } else if (obj._seconds || obj.seconds) {
        const seconds = obj._seconds || obj.seconds;
        date = new Date(seconds * 1000);
      } else {
        return "Fecha no válida";
      }
    } else if (typeof dateInput === "string") {
      if (dateInput.trim() === "") {
        return "Fecha no disponible";
      }

      if (/^\d+$/.test(dateInput)) {
        const timestamp = parseInt(dateInput, 10);
        date = new Date(timestamp > 9999999999 ? timestamp : timestamp * 1000);
      } else {
        date = new Date(dateInput);
      }
    } else if (typeof dateInput === "number") {
      date = new Date(dateInput > 9999999999 ? dateInput : dateInput * 1000);
    } else if (typeof dateInput === "bigint") {
      const timestamp = Number(dateInput);
      date = new Date(timestamp > 9999999999 ? timestamp : timestamp * 1000);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      return "Fecha no válida";
    }

    if (isNaN(date.getTime())) {
      return "Fecha no válida";
    }

    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return "Ahora";
    } else if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`;
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
    } else if (diffInDays === 1) {
      return "Ayer";
    } else if (diffInDays < 7) {
      return `Hace ${diffInDays} días`;
    } else {
      return formatDate(date);
    }
  } catch (error) {
    console.error(
      "Error formatting relative time:",
      error,
      "Input:",
      dateInput,
    );
    return "Fecha no válida";
  }
};

export const formatDateTime = (
  dateInput: string | number | bigint | Date | null | undefined,
): string => {
  if (!dateInput) return "Fecha no disponible";

  try {
    let date: Date;

    if (typeof dateInput === "object" && !(dateInput instanceof Date)) {
      if (Object.keys(dateInput as any).length === 0) {
        return "Fecha no disponible";
      }

      const obj = dateInput as any;
      if (obj.timestamp) {
        return formatDateTime(obj.timestamp);
      } else if (obj.date) {
        return formatDateTime(obj.date);
      } else if (obj._seconds || obj.seconds) {
        const seconds = obj._seconds || obj.seconds;
        date = new Date(seconds * 1000);
      } else {
        return "Fecha no válida";
      }
    } else if (typeof dateInput === "string") {
      if (dateInput.trim() === "") {
        return "Fecha no disponible";
      }

      if (/^\d+$/.test(dateInput)) {
        const timestamp = parseInt(dateInput, 10);
        date = new Date(timestamp > 9999999999 ? timestamp : timestamp * 1000);
      } else {
        date = new Date(dateInput);
      }
    } else if (typeof dateInput === "number") {
      date = new Date(dateInput > 9999999999 ? dateInput : dateInput * 1000);
    } else if (typeof dateInput === "bigint") {
      const timestamp = Number(dateInput);
      date = new Date(timestamp > 9999999999 ? timestamp : timestamp * 1000);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      return "Fecha no válida";
    }

    if (isNaN(date.getTime())) {
      return "Fecha no válida";
    }

    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date time:", error, "Input:", dateInput);
    return "Fecha no válida";
  }
};

export const isToday = (
  dateInput: string | number | bigint | Date | null | undefined,
): boolean => {
  if (!dateInput) return false;

  try {
    let date: Date;
    if (typeof dateInput === "object" && !(dateInput instanceof Date)) {
      if (Object.keys(dateInput as any).length === 0) {
        return false;
      }

      const obj = dateInput as any;
      if (obj.timestamp) {
        return isToday(obj.timestamp);
      } else if (obj.date) {
        return isToday(obj.date);
      } else if (obj._seconds || obj.seconds) {
        const seconds = obj._seconds || obj.seconds;
        date = new Date(seconds * 1000);
      } else {
        return false;
      }
    } else if (typeof dateInput === "string") {
      if (dateInput.trim() === "") {
        return false;
      }

      if (/^\d+$/.test(dateInput)) {
        const timestamp = parseInt(dateInput, 10);
        date = new Date(timestamp > 9999999999 ? timestamp : timestamp * 1000);
      } else {
        date = new Date(dateInput);
      }
    } else if (typeof dateInput === "number") {
      date = new Date(dateInput > 9999999999 ? dateInput : dateInput * 1000);
    } else if (typeof dateInput === "bigint") {
      const timestamp = Number(dateInput);
      date = new Date(timestamp > 9999999999 ? timestamp : timestamp * 1000);
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      return false;
    }

    if (isNaN(date.getTime())) {
      return false;
    }

    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    console.error(
      "Error checking if date is today:",
      error,
      "Input:",
      dateInput,
    );
    return false;
  }
};
