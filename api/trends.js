import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import api from "./axios";
import { getToken } from "../utils/token";

const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

const STORAGE_KEY = "trendsense_trends_cache";
const CACHE_FILE = FileSystem.documentDirectory
  ? FileSystem.documentDirectory + "trends_cache.json"
  : null;

// In-memory cache for the current session (instant reads after first load)
let _mem = null;

const loadPersisted = async () => {
  if (_mem) return _mem;
  try {
    if (Platform.OS === "web") {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } else if (CACHE_FILE) {
      const info = await FileSystem.getInfoAsync(CACHE_FILE);
      if (info.exists) {
        const raw = await FileSystem.readAsStringAsync(CACHE_FILE);
        return JSON.parse(raw);
      }
    }
  } catch {}
  return null;
};

const persist = async (data) => {
  _mem = data;
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } else if (CACHE_FILE) {
      await FileSystem.writeAsStringAsync(CACHE_FILE, JSON.stringify(data));
    }
  } catch {}
};

const clearPersisted = async () => {
  _mem = null;
  try {
    if (Platform.OS === "web") {
      localStorage.removeItem(STORAGE_KEY);
    } else if (CACHE_FILE) {
      const info = await FileSystem.getInfoAsync(CACHE_FILE);
      if (info.exists) await FileSystem.deleteAsync(CACHE_FILE);
    }
  } catch {}
};

/**
 * Get trends. Returns persisted cache unless forceRefresh is true.
 * Cache survives app restarts until the user explicitly refreshes.
 */
export const getTrends = async ({ forceRefresh = false } = {}) => {
  if (!forceRefresh) {
    const cached = await loadPersisted();
    if (cached) return cached;
  }

  try {
    const response = await api.get("/api/trends", { headers: authHeader() });
    await persist(response.data);
    return response.data;
  } catch (err) {
    // On failed refresh, don't wipe existing cache — let caller decide
    throw err;
  }
};

// Fire-and-forget prefetch from main menu
export const prefetchTrends = () => {
  getTrends().catch(() => {});
};
