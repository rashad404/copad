import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import russian from "../copy/public.ru.json";
import { supportedLanguage, type SiteLanguage } from "../utils/languages";
type Context = {
  language: SiteLanguage;
  setLanguage: (l: SiteLanguage) => void;
  c: (en: string, az: string, ru?: string) => string;
};
const Context = createContext<Context>(null!);
export function CopyProvider({ children }: { children: React.ReactNode }) {
  const [language, setValue] = useState<SiteLanguage>("az");
  useEffect(() => {
    AsyncStorage.getItem("i18nextLng")
      .then((l) => setValue(supportedLanguage(l) || "az"))
      .catch(() => {});
  }, []);
  function setLanguage(l: SiteLanguage) {
    setValue(l);
    void AsyncStorage.setItem("i18nextLng", l);
  }
  const c: Context["c"] = (en, az, ru) =>
    language === "az"
      ? az
      : language === "ru"
        ? ru || (russian as Record<string, string>)[en] || en
        : en;
  return (
    <Context.Provider value={{ language, setLanguage, c }}>
      {children}
    </Context.Provider>
  );
}
export const useCopy = () => useContext(Context);
