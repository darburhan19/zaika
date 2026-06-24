import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const deliveryFee = 49;

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
              )
            };
          }

          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                price: product.discountedPrice || product.price,
                image: product.images?.[0] || product.image,
                quantity
              }
            ]
          };
        }),
      updateItem: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item))
        })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      clearCart: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      tax: () => Number((get().subtotal() * 0.05).toFixed(2)),
      total: () => Number((get().subtotal() + get().tax() + deliveryFee).toFixed(2)),
      deliveryFee: () => deliveryFee
    }),
    { name: 'zaika-cart' }
  )
);
