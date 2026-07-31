// Lightweight auth/preference store.
//
// Reads (getToken, getUserId, ...) stay synchronous and read from an
// in-memory cache, so none of the existing call sites need to change.
// Writes (saveToken, ...) update the in-memory cache immediately *and*
// persist to secure/async storage in the background (native) or
// localStorage (web).
//
// On cold start the in-memory cache is empty until `hydrateSession()` is
// awaited — this must happen before any auth-gated screen reads the token
// (see app/index.tsx).
import { plainStorage, secureStorage } from "./storage";

let _token = null;
let _userId = null;
let _email = null;
let _role = null;
let _name = null;
let _preferences = null;
let _preferencesCompleted = false;

export const saveToken = (token) => {
  _token = token;
  secureStorage.setItem("token", token);
};

export const getToken = () => _token;

export const removeToken = () => {
  _token = null;
  secureStorage.removeItem("token");
};

export const saveUserId = (userId) => {
  _userId = userId;
  secureStorage.setItem("userId", userId);
};

export const getUserId = () => _userId;

export const removeUserId = () => {
  _userId = null;
  secureStorage.removeItem("userId");
};

export const saveRole = (role) => {
  _role = role;
  secureStorage.setItem("role", role);
};

export const getRole = () => _role;

export const removeRole = () => {
  _role = null;
  secureStorage.removeItem("role");
};

export const saveEmail = (email) => {
  _email = email;
  plainStorage.setItem("email", email);
};

export const getEmail = () => _email;

export const removeEmail = () => {
  _email = null;
  plainStorage.removeItem("email");
};

export const saveName = (name) => {
  _name = name;
  plainStorage.setItem("name", name);
};

export const getName = () => _name;

export const removeName = () => {
  _name = null;
  plainStorage.removeItem("name");
};

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

let _loginTime = null;

export const saveLoginTime = () => {
  _loginTime = Date.now().toString();
  plainStorage.setItem("loginTime", _loginTime);
};

export const isSessionExpired = () => {
  if (!_loginTime) return true;
  return Date.now() - parseInt(_loginTime, 10) > SESSION_TTL_MS;
};

export const clearSession = () => {
  _token = null;
  _userId = null;
  _email = null;
  _role = null;
  _name = null;
  _loginTime = null;
  secureStorage.removeItem("token");
  secureStorage.removeItem("userId");
  secureStorage.removeItem("role");
  plainStorage.removeItem("email");
  plainStorage.removeItem("name");
  plainStorage.removeItem("loginTime");
};

export const savePreferences = async (preferences) => {
  _preferences = preferences;
  _preferencesCompleted = true;
  await plainStorage.setItem("preferences", JSON.stringify(preferences));
  await plainStorage.setItem("preferencesCompleted", "true");
};

export const getPreferences = async () => {
  if (_preferences) return _preferences;
  const saved = await plainStorage.getItem("preferences");
  return saved ? JSON.parse(saved) : null;
};

export const getPreferencesCompleted = async () => {
  if (_preferencesCompleted) return true;
  return (await plainStorage.getItem("preferencesCompleted")) === "true";
};

export const resetPreferences = async () => {
  _preferences = null;
  _preferencesCompleted = false;
  await plainStorage.removeItem("preferences");
  await plainStorage.removeItem("preferencesCompleted");
};

// Loads any persisted session back into the in-memory cache. Must be
// awaited once at app startup, before any auth-gated screen reads
// getToken()/getUserId()/etc — see app/index.tsx.
let _hydrated = false;

export const hydrateSession = async () => {
  if (_hydrated) return;
  _hydrated = true;

  const [token, userId, role, email, name, loginTime] = await Promise.all([
    secureStorage.getItem("token"),
    secureStorage.getItem("userId"),
    secureStorage.getItem("role"),
    plainStorage.getItem("email"),
    plainStorage.getItem("name"),
    plainStorage.getItem("loginTime"),
  ]);

  _token = token;
  _userId = userId;
  _role = role;
  _email = email;
  _name = name;
  _loginTime = loginTime;
};
