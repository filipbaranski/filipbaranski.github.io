import { defineStore } from "pinia";
import { client } from "@/utils/axios-instance";
import { useAuthStore } from "@/stores/auth";
import { getStoredPeriodic, setStoredPeriodic } from "@/utils/helpers";

const isDataTheSame = (data: any, cache: any) => {
  if (cache === null) return false;
  const turnIntoString = (arr: Array<any>) => {
    return arr
      .map((object) => `${object._id}-${object.dayNumber}-${object.event}`)
      .join();
  };
  const dataString = turnIntoString(data);
  const cacheString = turnIntoString(cache);
  return dataString === cacheString;
};

export const usePeriodicStore = defineStore("periodicStore", {
  state: () => ({
    periodic: [],
    periodicLoading: false,
    periodicDateUpdating: [],
  }),
  actions: {
    async getPeriodic() {
      this.periodicLoading = true;
      const cachedDates = getStoredPeriodic();
      const storedDates = JSON.parse(cachedDates);
      if (cachedDates !== null) {
        this.periodic = storedDates;
      }
      await client
        .get(`/periodic/${useAuthStore().user.id}`)
        .then((response) => {
          if (isDataTheSame(response.data, storedDates) === false) {
            setStoredPeriodic(JSON.stringify(response.data));
            this.periodic = response.data;
          }
        })
        .finally(() => {
          this.periodicLoading = false;
          this.periodicDateUpdating = [];
        });
    },
    async postPeriodic(payload: any) {
      this.periodicLoading = true;
      payload.userId = useAuthStore().user.id;
      await client
        .post("/periodic", JSON.stringify(payload))
        .then(() => this.getPeriodic())
        .catch(() => {
          this.periodicLoading = false;
        });
    },
    async updatePeriodic(body: any) {
      const isPresent = this.periodicDateUpdating.indexOf(body.id) !== -1;
      body.payload.userId = useAuthStore().user.id;
      if (isPresent) {
        this.periodicDateUpdating.filter((item) => item !== body.id);
      } else {
        this.periodicDateUpdating.push(body.id);
      }
      await client
        .patch(`/periodic/${body.id}`, JSON.stringify(body.payload))
        .then(() => this.getPeriodic())
        .catch(() => {
          this.periodicDateUpdating = [];
        });
    },
    async deletePeriodic(id: any) {
      const isPresent = this.periodicDateUpdating.indexOf(id) !== -1;
      if (isPresent) {
        this.periodicDateUpdating.filter((item) => item !== id);
      } else {
        this.periodicDateUpdating.push(id);
      }
      await client
        .delete(`/periodic/${id}`)
        .then(() => this.getPeriodic())
        .catch(() => {
          this.periodicDateUpdating = [];
        });
    },
  },
});
