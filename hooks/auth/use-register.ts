import { useMutation } from '@tanstack/react-query';
import { router} from 'expo-router';
import { Alert } from 'react-native';
import { api } from '@/lib/api';
import type { RegisterFormData } from '@/lib/validation/authSchema';

export type RegisterResponse = {
    user: {
        id: string;
        email: string;
        fullName: string;
        phone: string;
    };
    token: string;
};

export function useRegister() {
    return useMutation <RegisterResponse, Error, RegisterFormData>({
        mutationFn: async (payload: RegisterFormData) => {
            const response = await api.post('/api/auth/register', payload);
            return response.data;
        },
        onSuccess: () => {
            Alert.alert(
                'Éxito',
                'Registro exitoso. Por favor, inicia sesión.',
            [{ text: 'OK', onPress: () => router.replace('/login') }]);
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || error.message || 'Error en el registro';
            Alert.alert('Error', message);
        }
    });
}