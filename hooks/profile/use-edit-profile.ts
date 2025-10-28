import { useState, useEffect } from 'react';
import { useUserProfile } from '@/context/UserProfileContext';
import { Alert } from 'react-native';

export function useEditProfile() {
  const { profile, updateProfile } = useUserProfile();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'El nombre completo es requerido');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Error', 'El teléfono es requerido');
      return;
    }

    try {
      setLoading(true);
      await updateProfile({ fullName: fullName.trim(), phone: phone.trim() });
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      return true;
    } catch (error: any) {
      console.error('Error actualizando perfil:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    fullName,
    setFullName,
    phone,
    setPhone,
    loading,
    handleSave,
  };
}