"use client";

import { createContext, useContext } from "react";
import { Lang, t } from "@/lib/lang";

const LanguageContext = createContext<Lang>("en");

export function LanguageProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LanguageContext.Provider value={lang}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  return useContext(LanguageContext);
}

export function useT() {
  const lang = useLang();
  return (key: string) => t[lang][key] ?? t["en"][key] ?? key;
}
