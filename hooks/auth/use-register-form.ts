import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterFormData } from '@/lib/validation/authSchema';
import { useRegister } from './use-register';

export function useRegisterForm() {
    const registerMutation = useRegister();

    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            phone: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = (data: RegisterFormData) => {
        registerMutation.mutate(data);
    };

    return {
        form,
        onSubmit,
        isLoading: registerMutation.isPending,
    };
}