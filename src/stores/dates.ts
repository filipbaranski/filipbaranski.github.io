import { defineStore } from "pinia";
import { client } from "@/utils/axios-instance";
import { useAuthStore } from "@/stores/auth";
import { getStoredDates, setStoredDates } from "@/utils/helpers";

const isDataTheSame = (data: any, cache: any) => {
  if (cache === null) return false;
  const turnIntoString = (arr: Array<any>) => {
    return arr
      .map(
        (object) =>
          `${object._id}-${object.day}-${object.month}-${object.year}-${object.event}`
      )
      .join();
  };
  const dataString = turnIntoString(data);
  const cacheString = turnIntoString(cache);
  return dataString === cacheString;
};

export const useDatesStore = defineStore("datesStore", {
  state: () => ({
    dates: [],
    datesLoading: false,
    datesDateUpdating: [],
  }),
  actions: {
    async getDates() {
      this.datesLoading = true;
      const cachedDates = getStoredDates();
      const storedDates = JSON.parse(cachedDates);
      if (cachedDates !== null) {
        this.dates = storedDates;
      }
      await client
        .get(`/dates/${useAuthStore().user.id}`)
        .then((response) => {
          if (isDataTheSame(response.data, storedDates) === false) {
            setStoredDates(JSON.stringify(response.data));
            this.dates = response.data;
          }
        })
        .finally(() => {
          this.datesLoading = false;
          this.datesDateUpdating = [];
        });
    },
    async postDate(payload: any) {
      this.datesLoading = true;
      payload.userId = useAuthStore().user.id;
      await client
        .post("/date", JSON.stringify(payload))
        .then(() => this.getDates())
        .catch(() => {
          this.datesLoading = false;
        });
    },
    async updateDate(body: any) {
      const isPresent = this.datesDateUpdating.indexOf(body.id) !== -1;
      body.payload.userId = useAuthStore().user.id;
      if (isPresent) {
        this.datesDateUpdating.filter((item) => item !== body.id);
      } else {
        this.datesDateUpdating.push(body.id);
      }
      await client
        .patch(`/date/${body.id}`, JSON.stringify(body.payload))
        .then(() => this.getDates())
        .catch(() => {
          this.datesDateUpdating = [];
        });
    },
    async deleteDate(id: any) {
      const isPresent = this.datesDateUpdating.indexOf(id) !== -1;
      if (isPresent) {
        this.datesDateUpdating.filter((item) => item !== id);
      } else {
        this.datesDateUpdating.push(id);
      }
      await client
        .delete(`/date/${id}`)
        .then(() => this.getDates())
        .catch(() => {
          this.datesDateUpdating = [];
        });
    },
  },
});
