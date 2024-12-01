import { defineStore } from "pinia";
import { client } from "@/utils/axios-instance";
import { useAuthStore } from "@/stores/auth";
import { getStoredCalendar, setStoredCalendar } from "@/utils/helpers";

type BasicDateType = {
  month: Number;
  year: Number;
};

const emptyCalendar = ({
  month,
  year,
  user,
}: {
  month: any;
  year: any;
  user: any;
}) => ({
  _id: "",
  is_cube: [] as any[],
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
  const relevantData: any = { is_cube: newData.is_cube, red: newData.red };
  Object.keys(relevantData).forEach((key) => {
    const cachedItem = cachedData[key].toString();
    const newItem = relevantData[key].toString();
    returnArray.push(cachedItem === newItem);
  });
  if (returnArray.indexOf(false) !== -1) return false;
  return true;
};

export const useCalendarStore = defineStore("calendarStore", {
  state: () => ({
    calendar: {
      _id: "",
      is_cube: [],
      red: [],
      month: 0,
      year: 0,
      user: "",
    },
    calendarLoading: false,
  }),
  actions: {
    async getMonth(body: BasicDateType) {
      let result;
      this.calendarLoading = true;
      const cachedCalendar = getStoredCalendar();
      const storedCalendar = JSON.parse(cachedCalendar);
      if (cachedCalendar !== null) this.calendar = storedCalendar;
      const formattedRequest = `${body.year}/${body.month}/${
        useAuthStore().user.id
      }`;
      await client
        .get(`/calendar/${formattedRequest}`)
        .then((response) => {
          if (isCalendarDataTheSame(response.data, storedCalendar) === false) {
            setStoredCalendar(JSON.stringify(response.data));
            this.calendar = response.data;
          }
          this.calendarLoading = false;
          result = true;
        })
        .catch(() => {
          if (body.month !== Number(storedCalendar.month)) {
            // For entering new month offline
            this.calendar = emptyCalendar({
              month: body.month,
              year: body.year,
              user: useAuthStore().user.id,
            });
          }
          this.calendarLoading = false;
          result = false;
        });
      return result;
    },
    async updateCalendar(body: any) {
      this.calendarLoading = true;
      const data = body.payload;
      const calendar = { ...this.calendar };
      const payload = {
        red: [...calendar.red],
        is_cube: [...calendar.is_cube],
        userId: useAuthStore().user.id,
      };
      if (payload.red.indexOf(data.day) === -1 && data.red === true) {
        payload.red.push(data.day);
      } else if (payload.red.indexOf(data.day) !== -1 && data.red === false) {
        payload.red = payload.red.filter((dates) => dates !== data.day);
      }
      if (payload.is_cube.indexOf(data.day) === -1 && data.is_cube === true) {
        payload.is_cube.push(data.day);
      } else if (
        payload.is_cube.indexOf(data.day) !== -1 &&
        data.is_cube === false
      ) {
        payload.is_cube = payload.is_cube.filter((dates) => dates !== data.day);
      }
      await client
        .patch(`/calendar/${body.id}`, JSON.stringify(payload))
        .then(() => {
          this.getMonth({
            year: body.payload.year,
            month: body.payload.month + 1,
          });
        })
        .catch(() => {
          this.calendarLoading = false;
        });
    },
  },
});
