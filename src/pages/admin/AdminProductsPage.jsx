import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { Button, GlassCard, SectionHeading } from '../../components/ui.jsx';
import { FormField, FormTextArea } from '../../components/FormField.jsx';
import { useForm } from 'react-hook-form';
import { Seo } from '../../components/Seo.jsx';

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const loadProducts = async () => {
    const response = await api.get('/products');
    setProducts(response.data.products || []);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      price: Number(values.price),
      images: values.image ? [values.image] : []
    };

    if (selected) {
      await api.patch(`/products/${selected._id}`, payload);
    } else {
      await api.post('/products', {
        ...payload,
        isFeatured: true
      });
    }

    reset();
    setSelected(null);
    loadProducts();
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <>
      <Seo title="Admin Products" description="Manage menu items." />
      <SectionHeading eyebrow="Menu management" title="Products" />
      <GlassCard className="mt-8">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Name" {...register('name')} />
          <FormField label="Price" type="number" {...register('price')} />
          <FormField label="Category ID" {...register('category')} />
          <FormField label="Image URL" {...register('image')} />
          <FormTextArea label="Description" className="md:col-span-2" {...register('description')} />
          <div className="md:col-span-2">
            <Button className="bg-gold text-surface-900 hover:bg-[#efcf88]">Add product</Button>
          </div>
        </form>
      </GlassCard>
      <div className="mt-6 space-y-4">
        {products.map((product) => (
          <GlassCard key={product._id} className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-2xl">{product.name}</p>
              <p className="text-sm text-white/65">Rs. {product.price}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setSelected(product);
                  reset({
                    name: product.name,
                    price: product.price,
                    category: product.category?._id || product.category,
                    image: product.images?.[0] || '',
                    description: product.description
                  });
                }}
                className="border border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                Edit
              </Button>
              <Button
                onClick={() => deleteProduct(product._id)}
                className="border border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/20"
              >
                Delete
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
