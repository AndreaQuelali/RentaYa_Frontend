import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_data";
const STORAGE_VERSION_KEY = "storage_version";
const CURRENT_STORAGE_VERSION = "1.0.0";

export const storage = {
  async checkAndClearCorruptedStorage(): Promise<void> {
    try {
      const version = await AsyncStorage.getItem(STORAGE_VERSION_KEY);

      if (!version || version !== CURRENT_STORAGE_VERSION) {
        await this.clear();
        await AsyncStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
        return;
      }

      try {
        const token = await this.getToken();
        const user = await this.getUser();

        if ((token && !user) || (!token && user)) {
          console.warn("Inconsistent storage detected, clearing");
          await this.clear();
          await AsyncStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
        }
      } catch (validationError) {
        console.error("Storage validation failed, clearing:", validationError);
        await this.clear();
        await AsyncStorage.setItem(STORAGE_VERSION_KEY, CURRENT_STORAGE_VERSION);
      }
    } catch (error) {
      console.error("Error checking storage health:", error);
      try {
        await AsyncStorage.clear();
      } catch (clearError) {
        console.error("Critical: Could not clear storage:", clearError);
      }
    }
  },
  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error("Error setting token:", error);
      throw error;
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error("Error removing token:", error);
    }
  },

  async setRefreshToken(refreshToken: string): Promise<void> {
    try {
      await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error("Error setting refresh token:", error);
      throw error;
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error getting refresh token:", error);
      return null;
    }
  },

  async removeRefreshToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error("Error removing refresh token:", error);
    }
  },

  async setUser(user: object): Promise<void> {
    try {
      const userString = JSON.stringify(user);
      await AsyncStorage.setItem(USER_KEY, userString);
    } catch (error) {
      console.error("Error setting user:", error);
      throw error;
    }
  },

  async getUser(): Promise<object | null> {
    try {
      const user = await AsyncStorage.getItem(USER_KEY);
      if (!user) return null;

      const parsedUser = JSON.parse(user);

      if (!parsedUser.id || !parsedUser.email) {
        console.warn("Corrupted user data detected, removing");
        await this.removeUser();
        return null;
      }

      return parsedUser;
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Intentar limpiar el usuario corrupto
      try {
        await this.removeUser();
      } catch (removeError) {
        console.error("Could not remove corrupted user:", removeError);
      }
      return null;
    }
  },

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error("Error removing user:", error);
    }
  },

  async clear(): Promise<void> {
    const keysToRemove = [TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY];

    try {
      await AsyncStorage.multiRemove(keysToRemove);
      console.log("Storage cleared successfully");
    } catch (error) {
      console.error("Error clearing storage with multiRemove:", error);
      // Intentar eliminar individualmente
      for (const key of keysToRemove) {
        try {
          await AsyncStorage.removeItem(key);
        } catch (individualError) {
          console.error(`Error removing ${key}:`, individualError);
        }
      }
    }
  },

  async validateSession(): Promise<boolean> {
    try {
      const token = await this.getToken();
      const user = await this.getUser();

      if (!token || !user) {
        return false;
      }

      const userWithRole = user as any;
      if (!userWithRole.id || !userWithRole.email) {
        console.warn("User missing critical fields, session invalid");
        return false;
      }

      return true;
    } catch (error) {
      console.error("Session validation failed:", error);
      return false;
    }
  },
};
