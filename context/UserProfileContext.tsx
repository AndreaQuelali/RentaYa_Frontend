import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
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
  clearProfile: () => void;
  setProfileFromLogin: (userData: any) => void;
}

export const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      if (!profile || profile.id !== user.id || profile.profilePhoto !== user.profilePhoto) {
        const userProfile: UserProfile = {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          phone: user.phone || '',
          profilePhoto: user.profilePhoto || null,
          verificationStatus: user.statusVerification || 'pending',
          createdAt: (user as any).createdAt || new Date().toISOString(),
          updatedAt: (user as any).updatedAt || new Date().toISOString(),
        };
        setProfile(userProfile);
        setLoading(false);
      }
    } else if (!user && profile) {
      setProfile(null);
    }
  }, [user?.id, user?.profilePhoto, user?.fullName, user?.phone, user?.email]);

  
  const fetchProfile = async () => {
    if (!user?.id) {
      return;
    }
    setLoading(true);
    try {
      const response = await api.get('/api/users/profile');
      const fetchedProfile = response.data.data as UserProfile;
      if (fetchedProfile.id !== user.id) {
        throw new Error('Profile mismatch during manual fetch');
      }
      setProfile(fetchedProfile);
    } catch (error) {
      console.error('[Profile] Error in manual fetch:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const response = await api.put('/api/users/profile', data);
      const updatedProfile = response.data.data as UserProfile;
      
      if (user?.id && updatedProfile.id === user.id) {
        setProfile(updatedProfile);
        await updateUser({
          fullName: updatedProfile.fullName,
          phone: updatedProfile.phone,
          email: updatedProfile.email,
        });
      }
    } catch (err: any) {
      console.error('[Profile] Error updating profile:', err);
      throw err;
    }
  };

  const uploadProfileImage = async (uri: string) => {
    try {
      const formData = new FormData();
      const filename = uri.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('profileImage', {
        uri,
        name: filename,
        type,
      } as any);

      const response = await api.post('/api/users/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const updatedProfile = response.data.data as UserProfile;
      
      if (user?.id && updatedProfile.id === user.id) {
        setProfile(updatedProfile);
        await updateUser({ 
          profilePhoto: updatedProfile.profilePhoto 
        } as any);
      }
    } catch (err: any) {
      console.error('[Profile] Error uploading profile image:', err);
      throw err;
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const clearProfile = () => {
    setProfile(null);
    setLoading(false);
    setError(null);
  };

  const setProfileFromLogin = (userData: any) => {
    const userProfile: UserProfile = {
      id: userData.id,
      email: userData.email,
      fullName: userData.fullName,
      phone: userData.phone || '',
      profilePhoto: userData.profilePhoto || null,
      verificationStatus: userData.statusVerification || 'pending',
      createdAt: userData.createdAt || new Date().toISOString(),
      updatedAt: userData.updatedAt || new Date().toISOString(),
    };
    setProfile(userProfile);
    setLoading(false);
    setError(null);
  };

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
        clearProfile,
        setProfileFromLogin,
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