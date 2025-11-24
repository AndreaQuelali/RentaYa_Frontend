import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_data";

export const storage = {
  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async getToken(): Promise<string | null> {
    return AsyncStorage.getItem(TOKEN_KEY);
  },

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(TOKEN_KEY);
  },

  async setRefreshToken(refreshToken: string): Promise<void> {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  },

  async removeRefreshToken(): Promise<void> {
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  async setUser(user: object): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async getUser(): Promise<object | null> {
    try {
      const user = await AsyncStorage.getItem(USER_KEY);
      if (!user) return null;

      const parsedUser = JSON.parse(user);

      if (!parsedUser.id || !parsedUser.email) {
        console.warn("Corrupted user data detected");
        return null;
      }

      return parsedUser;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(USER_KEY);
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
      console.log("Storage cleared successfully");
    } catch (error) {
      console.error("Error clearing storage:", error);
      try {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
      } catch (individualError) {
        console.error("Error clearing storage individually:", individualError);
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
