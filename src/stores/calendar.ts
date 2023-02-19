import { defineStore } from 'pinia'

const api = 'https://rich-plum-barnacle-wrap.cyclic.app';

type BasicDateType = {
  month: Number,
  year: Number,
}

const emptyCalendar = ({ month, year, user }: {month: any, year: any, user: any}) => ({
  _id: "",
  no_cube: [] as any[],
  number: [null] as any[],
  red: [] as any[],
  month,
  year,
  user,
});
  
const isCalendarDataTheSame = (data: any, cache: any) => {
  const returnArray: Array<Boolean> = [];
  if (cache === null) return false;
  const newData = { ...data };
  const cachedData = { ...cache };
  const newId = newData._id.toString();
  const cachedId = cachedData._id.toString();
  if (newId !== cachedId) return false;
  const relevantData: any = { no_cube: newData.no_cube, red: newData.red, number: newData.number };
  Object.keys(relevantData).forEach((key) => {
    const cachedItem = cachedData[key].toString();
    const newItem = relevantData[key].toString();
    returnArray.push(cachedItem === newItem);
  });
  if (returnArray.indexOf(false) !== -1) return false;
  return true;
};

export const useCalendarStore = defineStore('calendarStore', {
  state: () => ({
    calendar: {
      _id: "",
      no_cube: [],
      number: [null],
      red: [],
      month: 0,
      year: 0,
      user: "",
    },
    calendarLoading: false,
    calendarDaysUpdating: [],
  }),
  actions: {
    async getMonth(body: BasicDateType) {
      let result;
      this.calendarLoading = true;
      const cachedCalendar = localStorage.getItem('calendar');
      const storedCalendar = JSON.parse(cachedCalendar);
      if (cachedCalendar !== null) this.calendar = storedCalendar;
      const formattedRequest = `${body.year}/${body.month}/${localStorage.getItem('userId')}`;
      await fetch(`${api}/calendar/${formattedRequest}`,
        { headers: { 'bearer': localStorage.getItem('userToken') || "" } })
        .then((response) => response.json())
        .then((data) => {
          if (isCalendarDataTheSame(data, storedCalendar) === false) {
            localStorage.setItem('calendar', JSON.stringify(data));
            this.calendar = data;
          }
          this.calendarLoading = false;
          this.calendarDaysUpdating = [];
          result = true;
        })
        .catch(() => {
          if (body.month !== Number(storedCalendar.month)) {
            this.calendar = emptyCalendar({ month: body.month, year: body.year, user: localStorage.getItem('userId') });
          }
          this.calendarLoading = false;
          this.calendarDaysUpdating = [];
          result = false;
        });
      return result;
    },
    async updateCalendar(body: any) {
      this.calendarLoading = true;
      const data = body.payload;
      const date = `${data.day}.${data.month}.${data.year}`;
      const isPresent = this.calendarDaysUpdating.indexOf(date) !== -1;
      if (isPresent) {
        const filteredArray = this.calendarDaysUpdating.filter((item: any) => item !== date)
        this.calendarDaysUpdating = filteredArray;
      } else {
        this.calendarDaysUpdating.push(date);
      }
      const calendar = { ...this.calendar };
      const payload = {
        number: [...calendar.number],
        red: [...calendar.red],
        no_cube: [...calendar.no_cube],
        userId: localStorage.getItem('userId'),
      };
      payload.number[data.day - 1] = parseInt(data.number, 10);
      if (payload.red.indexOf(data.day) === -1 && data.red === true) {
        payload.red.push(data.day);
      } else if (payload.red.indexOf(data.day) !== -1 && data.red === false) {
        payload.red = payload.red.filter((dates) => dates !== data.day);
      }
      if (payload.no_cube.indexOf(data.day) === -1 && data.no_cube === true) {
        payload.no_cube.push(data.day);
      } else if (payload.no_cube.indexOf(data.day) !== -1 && data.no_cube === false) {
        payload.no_cube = payload.no_cube.filter((dates) => dates !== data.day);
      }
      await fetch(`${api}/calendar/${body.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'bearer': localStorage.getItem('userToken') || ""},
        body: JSON.stringify(payload),
      })
        .then(() => {
          this.getMonth({ year: body.payload.year, month: body.payload.month + 1 });
        })
        .catch(() => {
          this.calendarLoading = false;
          this.calendarDaysUpdating = [];
        });
    },
  },
});
