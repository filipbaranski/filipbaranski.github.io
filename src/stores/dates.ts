import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { getStoredDates, setStoredDates } from "@/utils/helpers";

const postDateArray = ({ newDatesArray }: { newDatesArray: any }) => {
  const datesToStore = JSON.stringify(newDatesArray);
  setStoredDates(datesToStore);
};

export const useDatesStore = defineStore("datesStore", {
  state: () => ({
    dates: [],
  }),
  actions: {
    async getDates() {
      const cachedDates = getStoredDates();
      const storedDates = JSON.parse(cachedDates);
      if (cachedDates !== null) {
        this.dates = storedDates;
      } else {
        const newDatesArray = [...this.dates];
        this.dates = [];
        postDateArray({ newDatesArray });
      }
    },
    async postDate(body: any) {
      const dateToSave = { id: uuidv4(), ...body };
      const newDatesArray = [dateToSave, ...this.dates];
      this.dates = newDatesArray;
      postDateArray({ newDatesArray });
    },
    async updateDate(body: any) {
      const oldDatesArray = [...this.dates];
      const indexToUpdate = oldDatesArray.findIndex(
        (item) => item.id === body.id
      );
      if (indexToUpdate !== -1) {
        oldDatesArray[indexToUpdate] = body;
        const newDatesArray = oldDatesArray;
        this.dates = newDatesArray;
        postDateArray({ newDatesArray });
      }
    },
    async deleteDate(id: any) {
      const newDatesArray = this.dates.filter((items) => items.id !== id);
      this.dates = newDatesArray;
      postDateArray({ newDatesArray });
    },
  },
});
