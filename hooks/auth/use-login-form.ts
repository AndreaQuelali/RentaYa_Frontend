import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/lib/validation/authSchema';
import { useAuth } from './use-auth';

export function useLoginForm() {
  const { loginMutation } = useAuth();
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return {
    form,
    onSubmit,
    isLoading: loginMutation.isLoading,
  };
}