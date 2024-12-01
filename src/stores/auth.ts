import { defineStore } from "pinia";
import { useCalendarStore } from "@/stores/calendar";
import { useDatesStore } from "@/stores/dates";
import { usePeriodicStore } from "@/stores/periodic";
import { client } from "@/utils/axios-instance";
import { setStoredUser } from "@/utils/helpers";

export const useAuthStore = defineStore("authStore", {
  state: () => ({
    user: {
      id: "",
      token: "",
    },
    lastDay: "",
    error: false,
    loading: false,
  }),
  getters: {
    isAuthenticated(state) {
      const result =
        state.user.id === "" || state.user.token === "" ? false : true;
      return result;
    },
  },
  actions: {
    async clearUserData() {
      this.user.token = "";
      this.user.id = "";
    },
    async login(username: String, password: String) {
      this.loading = true;
      await client
        .post("/signin", JSON.stringify({ username, password }))
        .then((response) => {
          const userData = response.data;
          setStoredUser(userData);
          this.user.token = userData.token;
          this.user.id = userData.id;
          this.router.push("/");
        })
        .then(() => {
          const date = new Date();
          useCalendarStore().getMonth({
            year: date.getFullYear(),
            month: date.getMonth() + 1,
          });
          useDatesStore().getDates();
          usePeriodicStore().getPeriodic();
        })
        .catch((error) => {
          this.error = true;
          return error;
        });
      this.loading = false;
    },
  },
});
