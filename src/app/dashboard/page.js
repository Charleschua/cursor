"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Notification from "@/components/Notification";
import ApiKeysSection from "@/components/ApiKeysSection";

export default function DashboardPage() {
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success"); // "success" | "danger"
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    <div className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-12 lg:px-0">
        <Sidebar
          sidebarOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 space-y-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#e0c3fc] via-[#fbdcde] to-[#fefae0] p-8 text-slate-800 shadow">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="uppercase text-xs font-semibold tracking-[0.3em] text-slate-600">
                  Current Plan
                </p>
                <h1 className="mt-2 text-4xl font-semibold">Researcher</h1>
                <p className="mt-2 text-sm text-slate-600">API Usage · Monthly plan</p>
              </div>
              <button className="rounded-full border border-white/70 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-white/50">
                Manage Plan
              </button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-700">
              <span className="flex items-center gap-2 rounded-full bg-white/70 px-3 py-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Pay as you go
              </span>
              <span>0 / 1,000 Credits</span>
            </div>
          </div>

          <section className="grid gap-6 lg:grid-cols-[3fr,2fr]">
            <ApiKeysSection onNotify={notify} />

            <div className="space-y-6">
              <article className="rounded-3xl bg-white p-6 shadow-sm">
                <header className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-500">Remote MCP</p>
                    <p className="text-xs text-slate-400">
                      Connect directly to Tavily’s remote MCP server without configuring locally.
                    </p>
                  </div>
                  <select
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs"
                    value={mcpFilter}
                    onChange={(event) => setMcpFilter(event.target.value)}
                  >
                    <option value="all">default</option>
                    <option value="dev">dev</option>
                    <option value="prod">prod</option>
                  </select>
                </header>
                <button className="mt-6 w-full rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white">
                  Generate MCP Link
                </button>
              </article>

              <article className="rounded-3xl bg-[#141624] p-6 text-white shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">Tavily Expert</p>
                <h3 className="mt-3 text-2xl font-semibold">Always up to date with the latest docs & best practices.</h3>
                <p className="mt-4 text-sm text-white/80">
                  Use the AI-native IDE agent to implement, test, and optimize Tavily tooling inside your workspace.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {["vscode", "cursor", "bolt", "windsurf"].map((platform) => (
                    <span key={platform} className="rounded-2xl bg-white/10 px-4 py-2 text-sm capitalize">
                      {platform}
                    </span>
                  ))}
                </div>
                <button className="mt-6 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900">
                  Get your Tavily Expert
                </button>
              </article>
            </div>
          </section>

          <footer className="flex flex-wrap items-center justify-between rounded-3xl bg-white p-6 text-sm shadow-sm">
            <p className="text-slate-500">Have any questions, feedback or need support?</p>
            <button className="rounded-full border border-slate-200 px-4 py-2 font-semibold text-slate-900">
              Contact us
            </button>
          </footer>
        </main>
      </div>

      <Notification message={toastMessage} variant={toastVariant} />
    </div>
  );
}

