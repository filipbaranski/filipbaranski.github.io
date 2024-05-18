import { defineStore } from "pinia";
import { getStoredCalendar, setStoredCalendar } from "@/utils/helpers";

export const useCalendarStore = defineStore("calendarStore", {
  state: () => ({
    calendar: {
      is_cube: [],
      red: [],
      month: 0,
      year: 0,
    },
  }),
  actions: {
    async getMonth(body: any) {
      const cachedCalendar = getStoredCalendar();
      const storedCalendar = JSON.parse(cachedCalendar);
      if (cachedCalendar !== null && storedCalendar.month === body.month) {
        this.calendar = storedCalendar;
      } else {
        this.calendar.is_cube = [];
        this.calendar.red = [];
        this.calendar.month = body.month;
        this.calendar.year = body.year;
        const newCalendarObject = { ...this.calendar };
        const calendarToStore = JSON.stringify(newCalendarObject);
        setStoredCalendar(calendarToStore);
      }
    },
    async updateCalendar(body: any) {
      const newCalendarObject = JSON.parse(JSON.stringify(this.calendar));
      const data = body.payload;
      const editedDay = data.day;
      const oldCalendarCubes = newCalendarObject.is_cube;
      const oldCalendarReds = newCalendarObject.red;
      const isDayInCubes = oldCalendarCubes.indexOf(editedDay) !== -1;
      const isDayInReds = oldCalendarReds.indexOf(editedDay) !== -1;
      if (!isDayInCubes && data.is_cube) {
        newCalendarObject.is_cube.push(editedDay);
      }
      if (isDayInCubes && !data.is_cube) {
        const index = newCalendarObject.is_cube.indexOf(editedDay);
        newCalendarObject.is_cube.splice(index, 1);
      }
      if (!isDayInReds && data.red) {
        newCalendarObject.red.push(editedDay);
      }
      if (isDayInReds && !data.red) {
        const index = newCalendarObject.red.indexOf(editedDay);
        newCalendarObject.red.splice(index, 1);
      }
      this.calendar.is_cube = newCalendarObject.is_cube;
      this.calendar.red = newCalendarObject.red;
      const calendarToStore = JSON.stringify(newCalendarObject);
      setStoredCalendar(calendarToStore);
    },
  },
});
