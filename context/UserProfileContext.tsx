import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth as useAuthHook } from '@/hooks/auth/use-auth';
import { api } from '@/lib/api';

interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  profilePhoto: string | null;
  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  uploadProfileImage: (uri: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuthHook();

  const fetchProfile = React.useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/users/profile');
      setProfile(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Error al obtener el perfil');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.put('/api/users/profile', data);
      setProfile(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el perfil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadProfileImage = async (uri: string) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      const filename = uri.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('image', {
        uri,
        name: filename,
        type,
      } as any);

      const response = await api.post('/api/users/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfile(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [isAuthenticated, fetchProfile]);

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        fetchProfile,
        updateProfile,
        uploadProfileImage,
        refreshProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}