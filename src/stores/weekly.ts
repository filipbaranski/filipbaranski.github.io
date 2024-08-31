import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { getStoredWeekly, setStoredWeekly } from "@/utils/helpers";

const postDateArray = ({ newDatesArray }: { newDatesArray: any }) => {
  const datesToStore = JSON.stringify(newDatesArray);
  setStoredWeekly(datesToStore);
};

export const useWeeklyStore = defineStore("weeklyStore", {
  state: () => ({
    weekly: [],
  }),
  actions: {
    async getWeekly() {
      const cachedDates = getStoredWeekly();
      const storedDates = JSON.parse(cachedDates);
      if (cachedDates !== null) {
        this.weekly = storedDates;
      } else {
        const newDatesArray = [...this.weekly];
        this.weekly = [];
        postDateArray({ newDatesArray });
      }
    },
    async postWeekly(body: any) {
      const dateToSave = { id: uuidv4(), ...body };
      const newDatesArray = [dateToSave, ...this.weekly];
      this.weekly = newDatesArray;
      postDateArray({ newDatesArray });
    },
    async updateWeekly(body: any) {
      const oldDatesArray = [...this.weekly];
      const indexToUpdate = oldDatesArray.findIndex(
        (item) => item.id === body.id
      );
      if (indexToUpdate !== -1) {
        oldDatesArray[indexToUpdate] = body;
        const newDatesArray = oldDatesArray;
        this.weekly = newDatesArray;
        postDateArray({ newDatesArray });
      }
    },
    async deleteWeekly(id: any) {
      const newDatesArray = this.weekly.filter((items) => items.id !== id);
      this.weekly = newDatesArray;
      postDateArray({ newDatesArray });
    },
  },
});
