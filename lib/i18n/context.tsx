"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations, Locale, TranslationKey } from "./translations";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  numberLocale: string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "it",
  setLocale: () => {},
  t: (key) => key as string,
  numberLocale: "it-IT",
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("it");

  useEffect(() => {
    const stored = localStorage.getItem("frx-lang") as Locale | null;
    if (stored === "it" || stored === "en") setLocaleState(stored);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("frx-lang", l);
  }, []);

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>): string => {
      let str =
        (translations[locale] as Record<string, string>)[key as string] ??
        (translations.it as Record<string, string>)[key as string] ??
        (key as string);
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, String(v));
        });
      }
      return str;
    },
    [locale]
  );

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, t, numberLocale: locale === "en" ? "en-US" : "it-IT" }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
