import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { Button, GlassCard, SectionHeading } from '../../components/ui.jsx';
import { FormField, FormTextArea } from '../../components/FormField.jsx';
import { useForm } from 'react-hook-form';
import { Seo } from '../../components/Seo.jsx';

export function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const loadCoupons = async () => {
    const response = await api.get('/admin/coupons');
    setCoupons(response.data.coupons || []);
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const onSubmit = async (values) => {
    await api.post('/admin/coupons', {
      ...values,
      discountValue: Number(values.discountValue),
      minimumOrderAmount: Number(values.minimumOrderAmount || 0),
      maxDiscountAmount: values.maxDiscountAmount ? Number(values.maxDiscountAmount) : undefined,
      usageLimit: values.usageLimit ? Number(values.usageLimit) : undefined
    });
    reset();
    loadCoupons();
  };

  const deleteCoupon = async (id) => {
    await api.delete(`/admin/coupons/${id}`);
    loadCoupons();
  };

  return (
    <>
      <Seo title="Admin Coupons" description="Manage discount coupons." />
      <SectionHeading eyebrow="Coupons" title="Coupon system" />
      <GlassCard className="mt-8">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Code" {...register('code')} />
          <FormField label="Discount type" {...register('discountType')} />
          <FormField label="Discount value" type="number" {...register('discountValue')} />
          <FormField label="Minimum order amount" type="number" {...register('minimumOrderAmount')} />
          <FormField label="Max discount amount" type="number" {...register('maxDiscountAmount')} />
          <FormField label="Usage limit" type="number" {...register('usageLimit')} />
          <FormTextArea label="Description" className="md:col-span-2" {...register('description')} />
          <div className="md:col-span-2">
            <Button className="bg-gold text-surface-900 hover:bg-[#efcf88]">Create coupon</Button>
          </div>
        </form>
      </GlassCard>
      <div className="mt-6 space-y-4">
        {coupons.map((coupon) => (
          <GlassCard key={coupon._id} className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-2xl">{coupon.code}</p>
              <p className="mt-2 text-sm text-white/65">
                {coupon.discountType} - {coupon.discountValue}
              </p>
            </div>
            <Button
              onClick={() => deleteCoupon(coupon._id)}
              className="border border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/20"
            >
              Delete
            </Button>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
