// Cross-platform key/value persistence.
// - Web: localStorage (SecureStore/AsyncStorage aren't available there).
// - Native: SecureStore (Keychain/Keystore) for sensitive values, AsyncStorage
//   for everything else — SecureStore enforces a small per-value size limit
//   that JSON blobs like `preferences` can exceed.
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { isWeb } from "./platform";

const webGet = (key: string): string | null =>
  typeof window !== "undefined" && window.localStorage
    ? window.localStorage.getItem(key)
    : null;

const webSet = (key: string, value: string): void => {
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.setItem(key, value);
  }
};

const webRemove = (key: string): void => {
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.removeItem(key);
  }
};

export type KeyValueStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

// For sensitive values: auth token, user id, role.
export const secureStorage: KeyValueStorage = {
  getItem: async (key) => (isWeb ? webGet(key) : SecureStore.getItemAsync(key)),
  setItem: async (key, value) =>
    isWeb ? webSet(key, value) : SecureStore.setItemAsync(key, value),
  removeItem: async (key) =>
    isWeb ? webRemove(key) : SecureStore.deleteItemAsync(key),
};

// For everything else: email, name, login time, preferences blob, etc.
export const plainStorage: KeyValueStorage = {
  getItem: async (key) => (isWeb ? webGet(key) : AsyncStorage.getItem(key)),
  setItem: async (key, value) =>
    isWeb ? webSet(key, value) : AsyncStorage.setItem(key, value),
  removeItem: async (key) =>
    isWeb ? webRemove(key) : AsyncStorage.removeItem(key),
};
