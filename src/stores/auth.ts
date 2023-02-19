import { defineStore } from 'pinia'
import { useCalendarStore } from '@/stores/calendar';
import { useDatesStore } from '@/stores/dates';

const api = 'https://rich-plum-barnacle-wrap.cyclic.app';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    user: {
      id: '',
      token: '',
    },
    error: false,
    loading: false,
  }),
  getters: {
    isAuthenticated(state) {
      const result = state.user.token === '' ? false : true;
      return result;
    },
  },
  actions: {
    async login(username: String, password: String) {
      this.loading = true;
      await fetch(`${api}/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem('userToken', data.token);
          localStorage.setItem('userId', data.id);
          this.user.token = data.token;
          this.user.id = data.id;
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
