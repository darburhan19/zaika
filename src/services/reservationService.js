import api from './api.js';

export const reservationService = {
  createReservation: (payload) => api.post('/reservations', payload),
  getMyReservations: () => api.get('/reservations/mine')
};
