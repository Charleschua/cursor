"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Notification from "@/components/Notification";
import ApiKeysSection from "@/components/ApiKeysSection";

export default function DashboardPage() {
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success"); // "success" | "danger"
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mcpFilter, setMcpFilter] = useState("all");

  const notify = (message, variant = "success") => {
    setToastVariant(variant);
    setToastMessage(message);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const id = setTimeout(() => setToastMessage(""), 1800);
    return () => clearTimeout(id);
  }, [toastMessage]);

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-900 pt-14 sm:pt-16">
      <div className="mx-auto flex max-w-6xl gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 py-4 sm:py-8 lg:px-0 lg:py-12">
        <Sidebar
          sidebarOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 space-y-6 sm:space-y-8 min-w-0">
          <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#e0c3fc] via-[#fbdcde] to-[#fefae0] p-6 sm:p-8 text-slate-800 shadow">
            <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="uppercase text-xs font-semibold tracking-[0.3em] text-slate-600">
                  Current Plan
                </p>
                <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold">Researcher</h1>
                <p className="mt-2 text-sm text-slate-600">API Usage · Monthly plan</p>
              </div>
              <button className="rounded-full border border-white/70 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-white/50 self-start md:self-auto">
                Manage Plan
              </button>
            </div>
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-slate-700">
              <span className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Pay as you go
              </span>
              <span className="text-xs sm:text-sm">0 / 1,000 Credits</span>
            </div>
          </div>

          <section className="grid gap-4 sm:gap-6 lg:grid-cols-[3fr,2fr]">
            <ApiKeysSection onNotify={notify} />

            <div className="space-y-4 sm:space-y-6">
              <article className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-500">Remote MCP</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Connect directly to Tavily's remote MCP server without configuring locally.
                    </p>
                  </div>
                  <select
                    className="rounded-full border border-slate-200 px-3 py-2 text-xs sm:text-sm self-start sm:self-auto"
                    value={mcpFilter}
                    onChange={(event) => setMcpFilter(event.target.value)}
                  >
                    <option value="all">default</option>
                    <option value="dev">dev</option>
                    <option value="prod">prod</option>
                  </select>
                </header>
                <button className="mt-4 sm:mt-6 w-full rounded-xl sm:rounded-2xl bg-indigo-600 py-2.5 sm:py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
                  Generate MCP Link
                </button>
              </article>

              <article className="rounded-2xl sm:rounded-3xl bg-[#141624] p-4 sm:p-6 text-white shadow-sm">
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-white/70">Tavily Expert</p>
                <h3 className="mt-3 text-xl sm:text-2xl font-semibold">Always up to date with the latest docs & best practices.</h3>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-white/80">
                  Use the AI-native IDE agent to implement, test, and optimize Tavily tooling inside your workspace.
                </p>
                <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
                  {["vscode", "cursor", "bolt", "windsurf"].map((platform) => (
                    <span key={platform} className="rounded-xl sm:rounded-2xl bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm capitalize">
                      {platform}
                    </span>
                  ))}
                </div>
                <button className="mt-4 sm:mt-6 w-full sm:w-auto rounded-xl sm:rounded-2xl bg-white px-4 py-2.5 sm:py-3 text-sm font-semibold text-slate-900 hover:bg-gray-100 transition-colors">
                  Get your Tavily Expert
                </button>
              </article>
            </div>
          </section>

          <footer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 text-sm shadow-sm">
            <p className="text-slate-500 text-sm sm:text-base">Have any questions, feedback or need support?</p>
            <button className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-900 hover:bg-slate-50 transition-colors self-start sm:self-auto">
              Contact us
            </button>
          </footer>
        </main>
      </div>

      <Notification message={toastMessage} variant={toastVariant} />
    </div>
  );
}

