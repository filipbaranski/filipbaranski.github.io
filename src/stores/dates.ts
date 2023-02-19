import { defineStore } from 'pinia'

const api = 'https://rich-plum-barnacle-wrap.cyclic.app';

const isDataTheSame = (data: any, cache: any) => {
  let returnValue = true;
  if (cache === null) return false;
  const newData = [...data];
  const cachedData = [...cache];
  const newIds = newData.map((id) => id._id).toString();
  const cachedIds = cachedData.map((id) => id._id).toString();
  if (newIds !== cachedIds) return false;
  newData.forEach((entry) => {
    const {
      day, month, year, event, _id,
    } = entry;
    const cachedItem = cachedData.filter((item) => item._id === _id);
    if (cachedItem[0].day !== day
            || cachedItem[0].month !== month
            || cachedItem[0].year !== year
            || cachedItem[0].event !== event) returnValue = false;
  });
  return returnValue;
};

export const useDatesStore = defineStore('datesStore', {
  state: () => ({
    dates: [],
    datesLoading: false,
    datesDateUpdating: [],
  }),
  actions: {
    async getDates() {
      this.datesLoading = true;
      const cachedDates = localStorage.getItem('dates');
      const storedDates = JSON.parse(cachedDates);
      if (cachedDates !== null) {
        this.dates = storedDates;
      }
      await fetch(`${api}/dates/${localStorage.getItem('userId')}`,
        { headers: { 'bearer': localStorage.getItem('userToken') || "" } })
        .then((response) => response.json())
        .then((data) => {
          if (isDataTheSame(data, storedDates) === false) {
            localStorage.setItem('dates', JSON.stringify(data));
            this.dates = data;
          }
          this.datesLoading = false;
          this.datesDateUpdating = [];
        })
        .catch(() => {
          this.datesLoading = false;
          this.datesDateUpdating = [];
        });
    },
    async postDate(payload: any) {
      this.datesLoading = true;
      await fetch(`${api}/date`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'bearer': localStorage.getItem('userToken') || ""},
        body: JSON.stringify(payload),
      })
        .then(() => this.getDates())
        .catch(() => {
          this.datesLoading = false;
        });
    },
    async updateDate(body: any) {
      const isPresent = this.datesDateUpdating.indexOf(body.id) !== -1;
      if (isPresent) {
        this.datesDateUpdating.filter((item) => item !== body.id);
      } else {
        this.datesDateUpdating.push(body.id);
      }
      await fetch(`${api}/date/${body.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'bearer': localStorage.getItem('userToken') || ""},
        body: JSON.stringify(body.payload),
      })
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
      await fetch(`${api}/date/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'bearer': localStorage.getItem('userToken') || ""},
      })
        .then(() => this.getDates())
        .catch(() => {
          this.datesDateUpdating = [];
        });
    },
  },
});
