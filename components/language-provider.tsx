"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { dictionaries, type Key, type Lang } from "@/lib/dictionaries";

type LanguageState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: Key) => string;
};

const LanguageContext = createContext<LanguageState>({
  lang: "en",
  setLang: () => {},
  t: (key) => dictionaries.en[key],
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("orbito-lang");
      if (saved === "en" || saved === "ro") {
        setLangState(saved);
      }
    } catch {
      // storage unavailable: keep the default language
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem("orbito-lang", next);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback((key: Key) => dictionaries[lang][key], [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
