// Lightweight auth/preference store with web localStorage fallback and in-memory fallback.
let _token = null;
let _userId = null;
let _email = null;
let _preferences = null;
let _preferencesCompleted = false;

const canUseLocalStorage = () => typeof window !== "undefined" && !!window.localStorage;

const setItem = (key, value) => {
  if (canUseLocalStorage()) window.localStorage.setItem(key, value);
};

const getItem = (key) => {
  if (canUseLocalStorage()) return window.localStorage.getItem(key);
  return null;
};

const removeItem = (key) => {
  if (canUseLocalStorage()) window.localStorage.removeItem(key);
};

export const saveToken = (token) => {
  _token = token;
  setItem("token", token);
};

export const getToken = () => _token || getItem("token");

export const removeToken = () => {
  _token = null;
  removeItem("token");
};

export const saveUserId = (userId) => {
  _userId = userId;
  setItem("userId", userId);
};

export const getUserId = () => _userId || getItem("userId");

export const removeUserId = () => {
  _userId = null;
  removeItem("userId");
};

export const saveEmail = (email) => {
  _email = email;
  setItem("email", email);
};

export const getEmail = () => _email || getItem("email");

export const removeEmail = () => {
  _email = null;
  removeItem("email");
};

export const savePreferences = async (preferences) => {
  _preferences = preferences;
  _preferencesCompleted = true;
  setItem("preferences", JSON.stringify(preferences));
  setItem("preferencesCompleted", "true");
};

export const getPreferences = async () => {
  if (_preferences) return _preferences;
  const saved = getItem("preferences");
  return saved ? JSON.parse(saved) : null;
};

export const getPreferencesCompleted = async () => {
  if (_preferencesCompleted) return true;
  return getItem("preferencesCompleted") === "true";
};

export const resetPreferences = async () => {
  _preferences = null;
  _preferencesCompleted = false;
  removeItem("preferences");
  removeItem("preferencesCompleted");
};
