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

  return (
    <div className="relative">
      {/* Hamburger button - always visible but positioned based on sidebar state */}
      <button
        type="button"
        onClick={onToggle}
        className={`mt-2 inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-600 hover:border-purple-400 hover:from-purple-100 hover:to-pink-100 hover:text-purple-700 shadow-md hover:shadow-lg transition-all duration-300 ease-out ${
          sidebarOpen
            ? "opacity-0 pointer-events-none scale-75"
            : "opacity-100 pointer-events-auto scale-100"
        }`}
        aria-label="Show menu"
      >
        {/* Hamburger icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-4 w-4 transition-transform duration-300"
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

      {/* Sidebar - always rendered but animated */}
      <aside
        className={`rounded-3xl bg-white/80 shadow-sm backdrop-blur transition-all duration-500 ease-out overflow-hidden ${
          sidebarOpen
            ? "w-60 opacity-100 translate-x-0 p-5"
            : "w-0 opacity-0 -translate-x-4 p-0"
        }`}
      >
        {/* Sidebar content - only visible when open */}
        <div
          className={`transition-all duration-300 ease-out ${
            sidebarOpen
              ? "opacity-100 delay-100 translate-x-0"
              : "opacity-0 delay-0 -translate-x-2"
          }`}
        >
          <div className="flex items-center justify-between gap-3 pb-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0" />
              <div className="text-sm min-w-0">
                <p className="font-semibold truncate">Charlie AI</p>
                <p className="text-xs text-slate-500 truncate">Personal</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-300 text-slate-600 hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-600 flex-shrink-0 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
              aria-label="Hide menu"
            >
              {/* X icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 transition-transform duration-200"
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
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md font-medium"
                        : "text-slate-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 font-medium"
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
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md font-medium"
                      : "text-slate-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700 font-medium"
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
        </div>
      </aside>
    </div>
  );
}
