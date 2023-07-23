import { defineStore } from 'pinia';
import { useCalendarStore } from '@/stores/calendar';
import { useDatesStore } from '@/stores/dates';
import { client } from '@/utils/axios-instance';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: {
      id: '',
      token: '',
    },
    lastDay: '',
    error: false,
    loading: false,
  }),
  getters: {
    isAuthenticated(state) {
      const result = (state.user.token === '' || state.user.id === '') ? false : true;
      return result;
    },
  },
  actions: {
    async login(username: String, password: String) {
      this.loading = true;
      await client.post('/signin', JSON.stringify({ username, password }))
        .then((response) => {
          localStorage.setItem('userToken', response.data.token);
          localStorage.setItem('userId', response.data.id);
          this.user.token = response.data.token;
          this.user.id = response.data.id;
          this.router.push('/');
        })
        .then(() => {
          const date = new Date();
          useCalendarStore().getMonth({ year: date.getFullYear(), month: date.getMonth() + 1 });
          useDatesStore().getDates();
        })
        .catch((error) => {
          this.error = true;
          return error;
        });
      this.loading = false;
    },
  },
});
