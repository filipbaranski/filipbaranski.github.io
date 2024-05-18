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

export { getStoredCalendar, setStoredCalendar, getStoredDates, setStoredDates };
