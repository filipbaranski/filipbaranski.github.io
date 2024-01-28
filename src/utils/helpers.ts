const clearStorage = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userId');
  localStorage.removeItem('userRole');
  localStorage.removeItem('dates');
  localStorage.removeItem('calendar');
};

const getStoredUser = () => {
  const token = localStorage.getItem('userToken') || null;
  const id = localStorage.getItem('userId') || null;
  const role = localStorage.getItem('userRole') || null;

  return { token, id, role };
};

const setStoredUser = (userData: any) => {
  localStorage.setItem('userToken', userData.token);
  localStorage.setItem('userId', userData.id);
  localStorage.setItem('userRole', userData.role);
};

const getStoredCalendar = () => {
  return localStorage.getItem('calendar');
};

const setStoredCalendar = (data: any) => {
  localStorage.setItem('calendar', data);
};

const getStoredDates = () => {
  return localStorage.getItem('dates');
};

const setStoredDates = (data: any) => {
  localStorage.setItem('dates', data);
};

export {
  clearStorage,
  getStoredUser,
  setStoredUser,
  getStoredCalendar,
  setStoredCalendar,
  getStoredDates,
  setStoredDates
};
