import { defineStore } from 'pinia';
import { useCalendarStore } from '@/stores/calendar';
import { useDatesStore } from '@/stores/dates';
import { client } from '@/utils/axios-instance';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: {
      id: '',
      token: '',
      role: '',
    },
    lastDay: '',
    error: false,
    loading: false,
  }),
  getters: {
    isAuthenticated(state) {
      const result = (state.user.token === '' || state.user.id === '') ? false : true;
      return result;
    }
  },
  actions: {
    async login(username: String, password: String) {
      this.loading = true;
      await client.post('/signin', JSON.stringify({ username, password }))
        .then((response) => {
          console.log(response)
          localStorage.setItem('userToken', response.data.token);
          localStorage.setItem('userId', response.data.id);
          localStorage.setItem('userRole', response.data.role);
          this.user.token = response.data.token;
          this.user.id = response.data.id;
          this.user.role = response.data.role;
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
