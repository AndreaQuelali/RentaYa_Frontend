import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { AppState, AppStateStatus } from "react-native";
import { notificationApi } from "@/lib/notificationApi";
import { useAuth } from "@/hooks/auth/use-auth";
import { disconnectSocket, onNotification, offNotification } from "@/lib/socket";

interface NotificationContextType {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  decrementUnreadCount: () => void;
  incrementUnreadCount: () => void;
  resetUnreadCount: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  const refreshUnreadCount = useCallback(async () => {
    try {
      const count = await notificationApi.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, []);

  const decrementUnreadCount = useCallback(() => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const incrementUnreadCount = useCallback(() => {
    setUnreadCount((prev) => prev + 1);
  }, []);

  const resetUnreadCount = useCallback(() => {
    setUnreadCount(0);
  }, []);

  useEffect(() => {
    if (!user?.id) {
      setUnreadCount(0);
      disconnectSocket();
      return;
    }

    // Conectar socket y suscribirse a notificaciones
    let socketCleanup: (() => void) | null = null;

    const setupSocket = async () => {
      try {
        
        // Escuchar notificaciones en tiempo real
        const handleNotification = (data: any) => {
          // Incrementar contador cuando llega una notificación
          incrementUnreadCount();
          // También refrescar el contador para asegurar sincronización
          refreshUnreadCount();
        };

        onNotification(handleNotification);

        socketCleanup = () => {
          offNotification(handleNotification);
        };
      } catch (error) {
        console.error("[NotificationContext] Error setting up socket:", error);
      }
    };

    setupSocket();

    // Actualizar inmediatamente al cargar
    refreshUnreadCount();

    // Actualizar cada 10 segundos (menos frecuente ya que tenemos sockets)
    const interval = setInterval(refreshUnreadCount, 10000);

    // Listener para cuando la app vuelve al foreground
    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        refreshUnreadCount();
      }
    });

    return () => {
      clearInterval(interval);
      subscription.remove();
      if (socketCleanup) {
        socketCleanup();
      }
      disconnectSocket();
    };
  }, [user?.id, refreshUnreadCount, incrementUnreadCount]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        refreshUnreadCount,
        decrementUnreadCount,
        incrementUnreadCount,
        resetUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotificationContext must be used within NotificationProvider"
    );
  }
  return context;
};
