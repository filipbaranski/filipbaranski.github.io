const clearStorage = () => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("dates");
  localStorage.removeItem("calendar");
};

const getStoredUser = () => {
  const token = localStorage.getItem("userToken") || null;
  const id = localStorage.getItem("userId") || null;

  return { token, id };
};

const setStoredUser = (userData: any) => {
  localStorage.setItem("userToken", userData.token);
  localStorage.setItem("userId", userData.id);
};

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

const getStoredPeriodic = () => {
  return localStorage.getItem("periodic");
};

const setStoredPeriodic = (data: any) => {
  localStorage.setItem("periodic", data);
};

export {
  clearStorage,
  getStoredUser,
  setStoredUser,
  getStoredCalendar,
  setStoredCalendar,
  getStoredDates,
  setStoredDates,
  getStoredPeriodic,
  setStoredPeriodic,
};
