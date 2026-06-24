import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService.js';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      loading: false,
      setAuth: ({ user, accessToken }) => set({ user, accessToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      clearAuth: () => set({ user: null, accessToken: null }),
      hydrate: async () => {
        const { accessToken } = get();
        if (!accessToken) return;
        try {
          set({ loading: true });
          const response = await authService.me();
          set({ user: response.data.user, loading: false });
        } catch {
          set({ user: null, accessToken: null, loading: false });
        }
      }
    }),
    {
      name: 'zaika-auth'
    }
  )
);
