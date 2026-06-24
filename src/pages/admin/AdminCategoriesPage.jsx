import { useEffect, useState } from 'react';
import api from '../../services/api.js';
import { Button, GlassCard, SectionHeading } from '../../components/ui.jsx';
import { FormField, FormTextArea } from '../../components/FormField.jsx';
import { useForm } from 'react-hook-form';
import { Seo } from '../../components/Seo.jsx';

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const loadCategories = async () => {
    const response = await api.get('/categories');
    setCategories(response.data.categories || []);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const onSubmit = async (values) => {
    await api.post('/categories', {
      ...values,
      isActive: true
    });
    reset();
    loadCategories();
  };

  const deleteCategory = async (id) => {
    await api.delete(`/categories/${id}`);
    loadCategories();
  };

  return (
    <>
      <Seo title="Admin Categories" description="Manage menu categories." />
      <SectionHeading eyebrow="Categories" title="Category management" />
      <GlassCard className="mt-8">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Name" {...register('name')} />
          <FormField label="Icon" {...register('icon')} />
          <FormTextArea label="Description" className="md:col-span-2" {...register('description')} />
          <div className="md:col-span-2">
            <Button className="bg-gold text-surface-900 hover:bg-[#efcf88]">Add category</Button>
          </div>
        </form>
      </GlassCard>
      <div className="mt-6 space-y-4">
        {categories.map((category) => (
          <GlassCard key={category._id} className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-2xl">{category.name}</p>
              <p className="text-sm text-white/65">{category.description}</p>
            </div>
            <Button onClick={() => deleteCategory(category._id)} className="border border-red-500/20 bg-red-500/10 text-red-200 hover:bg-red-500/20">
              Delete
            </Button>
          </GlassCard>
        ))}
      </div>
    </>
  );
}
