"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", path: "/dashboard" },
  { label: "API Playground", path: "/playground" },
  { label: "Use Cases", path: "#" },
  { label: "Billing", path: "#" },
  { label: "Settings", path: "#" },
  { label: "Documentation", path: "#" },
  { label: "Tavily MCP", path: "#" },
];

export default function Sidebar({ sidebarOpen, onToggle }) {
  const pathname = usePathname();

  // Closed state: show only a floating hamburger button
  if (!sidebarOpen) {
    return (
      <button
        type="button"
        onClick={onToggle}
        className="mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-800"
        aria-label="Show menu"
      >
        {/* Hamburger icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        >
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      </button>
    );
  }

  // Open state: full sidebar with X button at the top-right
  return (
    <aside className="w-60 rounded-3xl bg-white/80 p-5 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between gap-3 pb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500" />
          <div className="text-sm">
            <p className="font-semibold">Charlie AI</p>
            <p className="text-xs text-slate-500">Personal</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700"
          aria-label="Hide menu"
        >
          {/* X icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          >
            <path d="M6 6l12 12" />
            <path d="M18 6l-12 12" />
          </svg>
        </button>
      </div>

      <nav className="space-y-1 text-sm">
        {navItems.map((item, idx) => {
          const isActive = pathname === item.path;
          const isExternal = item.path === "#";
          
          const content = (
            <>
              <span>{item.label}</span>
              {idx === 5 || idx === 6 ? (
                <span className="text-xs text-slate-400">↗</span>
              ) : null}
            </>
          );

          if (isExternal) {
            return (
              <button
                key={item.label}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.path}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 ${
                isActive
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="mt-10 flex items-center gap-3 rounded-2xl bg-slate-900 p-4 text-white">
        <div className="rounded-full border border-white/30 px-3 py-1 text-xs">
          Operational
        </div>
        <div className="flex gap-3 text-lg">
          {["github", "twitter", "mail"].map((icon) => (
            <span key={icon} className="opacity-60">
              {icon === "mail" ? "✉" : icon === "github" ? "🐙" : "🐦"}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
