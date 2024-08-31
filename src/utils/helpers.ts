const getStoredCalendar = () => {
  return localStorage.getItem("calendar");
};

const setStoredCalendar = (data: any) => {
  localStorage.setItem("calendar", data);
};

const getStoredDates = () => {
  return localStorage.getItem("dates");
};

const setStoredDates = (data: any) => {
  localStorage.setItem("dates", data);
};

const getStoredWeekly = () => {
  return localStorage.getItem("weekly");
};

const setStoredWeekly = (data: any) => {
  localStorage.setItem("weekly", data);
};
export {
  getStoredCalendar,
  setStoredCalendar,
  getStoredDates,
  setStoredDates,
  getStoredWeekly,
  setStoredWeekly,
};
