import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useUserProfile } from '@/context/UserProfileContext';
import { Alert } from 'react-native';

export function useProfileImage() {
  const { uploadProfileImage } = useUserProfile();
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }

    return null;
  };

  const handleUpload = async (uri: string) => {
    try {
      setUploading(true);
      await uploadProfileImage(uri);
      Alert.alert('Éxito', 'Foto de perfil actualizada');
    } catch (error: any) {
      console.error('Error subiendo imagen:', error);
      Alert.alert('Error', 'No se pudo subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const selectImageSource = () => {
    Alert.alert(
      'Foto de perfil',
      'Elige una opción',
      [
        {
          text: 'Cámara',
          onPress: async () => {
            const uri = await takePhoto();
            if (uri) await handleUpload(uri);
          },
        },
        {
          text: 'Galería',
          onPress: async () => {
            const uri = await pickImage();
            if (uri) await handleUpload(uri);
          },
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  return {
    uploading,
    selectImageSource,
    pickImage,
    takePhoto,
    handleUpload,
  };
}