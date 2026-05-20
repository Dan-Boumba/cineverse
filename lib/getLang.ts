import { cookies } from "next/headers";
import { Lang, TMDB_LOCALE } from "./lang";

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const val = store.get("lang")?.value;
  return val === "fr" ? "fr" : "en";
}

export async function getLocale(): Promise<string> {
  const lang = await getLang();
  return TMDB_LOCALE[lang];
}
