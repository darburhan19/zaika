import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/useAuthStore.js';
import { authService } from '../services/authService.js';
import { GlassCard, Button } from '../components/ui.jsx';
import { FormField } from '../components/FormField.jsx';
import { Seo } from '../components/Seo.jsx';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(6)
});

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    // backend expects: username, email, password, mobile (or phone)
    const payload = {
      username: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone
    };

    const response = await authService.register(payload);
    setAuth(response.data);
    navigate('/');
  };

  return (
    <>
      <Seo title="Register" description="Create a Zaika Restaurant account." />
      <GlassCard className="mx-auto w-full max-w-md">
        <p className="text-xs uppercase tracking-[0.35em] text-gold">Join Zaika</p>
        <h1 className="mt-3 font-display text-4xl">Create account</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Name" {...register('name')} />
          <FormField label="Email" {...register('email')} />
          <FormField label="Phone" {...register('phone')} />
          <FormField label="Password" type="password" {...register('password')} />
          <Button className="w-full bg-gold text-surface-900 hover:bg-[#efcf88]">Create account</Button>
        </form>
        <div className="mt-5 text-sm text-white/70">
          <Link to="/login">Already have an account?</Link>
        </div>
      </GlassCard>
    </>
  );
}
