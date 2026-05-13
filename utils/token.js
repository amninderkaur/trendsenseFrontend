// In-memory auth store — replaces localStorage for sandbox environments.
// Values live for the lifetime of the JS module (i.e. the app session).
let _token = null;
let _userId = null;

export const saveToken = (token) => {
  _token = token;
};

export const getToken = () => {
  return _token;
};

export const removeToken = () => {
  _token = null;
};

export const saveUserId = (userId) => {
  _userId = userId;
};

export const getUserId = () => {
  return _userId;
};

export const removeUserId = () => {
  _userId = null;
};
