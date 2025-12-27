import { atom } from 'jotai';
import { atomWithStorage } from "jotai/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const selectedPaymentEnd = atom(null);
export const selectedExamsSubject = atom (null);
export const selectedExamSpecifc = atom(null);
export const selectedSubject = atom (null);
export const selectedSpecificTime = atom(null);
export const selectedSubjectSpecificContent= atom (null);

export const themeAtom = atomWithStorage(
  "app-theme",   // storage key
  "light",       // default theme
  {
    getItem: async (key) => {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : "light";
    },
    setItem: async (key, value) => {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: async (key) => {
      await AsyncStorage.removeItem(key);
    },
  }
);
