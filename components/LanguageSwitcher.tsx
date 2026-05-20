"use client";

import { useTransition, useState, useRef, useEffect } from "react";
import { setLanguage } from "@/app/actions";
import { useLang } from "@/context/LanguageContext";

const LANGUAGES = [
  { code: "en" as const, label: "English" },
  { code: "fr" as const, label: "Français" },
];

export default function LanguageSwitcher() {
  const lang = useLang();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (code: "en" | "fr") => {
    setOpen(false);
    if (code !== lang) startTransition(() => setLanguage(code));
  };

  const current = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={pending}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border transition-colors disabled:opacity-50 hover:border-white"
        style={{ borderColor: "#aaa", color: "#e5e5e5", background: "transparent" }}
      >
        {/* Globe */}
        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>

        {pending ? (
          <div className="w-3 h-3 border border-gray-400 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <span>{current.label}</span>
            <svg
              className={`w-3 h-3 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 w-36 overflow-hidden shadow-2xl z-50"
          style={{ background: "#000", border: "1px solid #555" }}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => select(l.code)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/10 transition-colors text-left"
              style={{ color: l.code === lang ? "#fff" : "#aaa" }}
            >
              <span>{l.label}</span>
              {l.code === lang && (
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
