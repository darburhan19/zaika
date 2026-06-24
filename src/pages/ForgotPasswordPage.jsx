import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '../services/authService.js';
import { GlassCard, Button } from '../components/ui.jsx';
import { FormField } from '../components/FormField.jsx';
import { Seo } from '../components/Seo.jsx';

const schema = z.object({ email: z.string().email() });

export function ForgotPasswordPage() {
  const [message, setMessage] = useState('');
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    await authService.forgotPassword(values);
    setMessage('Reset link prepared. Check your email inbox if SMTP is configured.');
  };

  return (
    <>
      <Seo title="Forgot Password" description="Reset your Zaika Restaurant password." />
      <GlassCard className="mx-auto w-full max-w-md">
        <h1 className="font-display text-4xl">Forgot password</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Email" {...register('email')} />
          <Button className="w-full bg-gold text-surface-900 hover:bg-[#efcf88]">Send reset link</Button>
        </form>
        {message ? <p className="mt-4 text-sm text-gold">{message}</p> : null}
      </GlassCard>
    </>
  );
}
