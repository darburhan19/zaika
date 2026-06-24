import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Seo } from '../components/Seo.jsx';
import { Button, GlassCard, SectionHeading } from '../components/ui.jsx';
import { FormField, FormTextArea } from '../components/FormField.jsx';
import { useCartStore } from '../store/useCartStore.js';
import { useAuthStore } from '../store/useAuthStore.js';
import { orderService } from '../services/orderService.js';
import { authService } from '../services/authService.js';

const schema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(6),
  addressLine1: z.string().min(3),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pinCode: z.string().min(4),
  landmark: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(['cod', 'razorpay']),
  couponCode: z.string().optional()
});

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);
  const [message, setMessage] = useState('');
  const { register, handleSubmit, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: 'razorpay' }
  });

  useEffect(() => {
    if (user) {
      setValue('fullName', user.name || '');
      setValue('phone', user.phone || '');
    }
  }, [user, setValue]);

  const onSubmit = async (values) => {
    if (!items.length) {
      setMessage('Your cart is empty.');
      return;
    }

    const payload = {
      shippingAddress: {
        fullName: values.fullName,
        phone: values.phone,
        addressLine1: values.addressLine1,
        addressLine2: values.addressLine2,
        city: values.city,
        state: values.state,
        pinCode: values.pinCode,
        landmark: values.landmark
      },
      paymentMethod: values.paymentMethod,
      couponCode: values.couponCode,
      notes: values.notes
    };

    const response = await orderService.createOrder(payload);
    if (values.paymentMethod === 'razorpay' && response.data.razorpayOrder) {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setMessage('Razorpay failed to load.');
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: response.data.razorpayOrder.amount,
        currency: response.data.razorpayOrder.currency,
        name: 'Zaika Restaurant',
        description: 'Food order payment',
        order_id: response.data.razorpayOrder.id,
        handler: async function (paymentResponse) {
          await orderService.verifyPayment({
            razorpayOrderId: paymentResponse.razorpay_order_id,
            razorpayPaymentId: paymentResponse.razorpay_payment_id,
            razorpaySignature: paymentResponse.razorpay_signature
          });
          clearCart();
          navigate('/orders');
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      return;
    }

    clearCart();
    navigate('/orders');
  };

  return (
    <>
      <Seo title="Checkout" description="Secure checkout for your Zaika Restaurant order." />
      <SectionHeading eyebrow="Checkout" title="Complete your order" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <GlassCard>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <FormField label="Full name" {...register('fullName')} />
            <FormField label="Phone number" {...register('phone')} />
            <FormField label="Address line 1" className="md:col-span-2" {...register('addressLine1')} />
            <FormField label="Address line 2" className="md:col-span-2" {...register('addressLine2')} />
            <FormField label="City" {...register('city')} />
            <FormField label="State" {...register('state')} />
            <FormField label="PIN Code" {...register('pinCode')} />
            <FormField label="Landmark" {...register('landmark')} />
            <FormField label="Coupon code" {...register('couponCode')} />
            <label className="block space-y-2">
              <span className="text-sm text-white/75">Payment method</span>
              <select
                {...register('paymentMethod')}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
              >
                <option value="razorpay">Razorpay</option>
                <option value="cod">Cash on delivery</option>
              </select>
            </label>
            <FormTextArea label="Order notes" className="md:col-span-2" {...register('notes')} />
            <div className="md:col-span-2">
              <Button type="submit" className="bg-gold text-surface-900 hover:bg-[#efcf88]">
                Place order
              </Button>
            </div>
          </form>
          {message ? <p className="mt-4 text-sm text-gold">{message}</p> : null}
        </GlassCard>

        <GlassCard className="space-y-4">
          <SectionHeading eyebrow="Review" title="Cart summary" />
          <div className="space-y-3 text-sm text-white/75">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4">
                <span className="truncate">{item.name} x {item.quantity}</span>
                <span>Rs. {item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <Button asChild className="w-full border border-white/10 bg-white/5 text-white hover:bg-white/10">
            <a href="/cart">Edit cart</a>
          </Button>
        </GlassCard>
      </div>
    </>
  );
}
