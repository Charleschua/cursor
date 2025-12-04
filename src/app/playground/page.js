"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Notification from "@/components/Notification";

export default function PlaygroundPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const notify = (message, variant = "success") => {
    setToastVariant(variant);
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 1800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      setError("Please enter an API key");
      notify("Please enter an API key", "danger");
      return;
    }

    // Navigate to /protected with the API key as a query parameter
    router.push(`/protected?key=${encodeURIComponent(apiKey.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-900">
      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-12 lg:px-0">
        <Sidebar
          sidebarOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="flex-1 space-y-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#e0c3fc] via-[#fbdcde] to-[#fefae0] p-8 text-slate-800 shadow">
            <div>
              <h1 className="text-4xl font-semibold">API Playground</h1>
              <p className="mt-2 text-sm text-slate-600">
                Test your API key and explore the Research API
              </p>
            </div>
          </div>

          <article className="rounded-3xl bg-white p-6 shadow-sm">
            <header className="mb-6">
              <p className="text-sm font-semibold text-slate-500">Validate API Key</p>
              <p className="text-xs text-slate-400">
                Enter your API key to validate and access protected content
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-slate-700 mb-2">
                  API Key
                </label>
                <input
                  id="apiKey"
                  type="password"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
                  placeholder="Enter your API key (e.g. dandi_dev_XXXXX)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition"
              >
                {loading ? "Processing..." : "Validate & Continue"}
              </button>
            </form>
          </article>
        </main>
      </div>

      <Notification message={toastMessage} variant={toastVariant} />
    </div>
  );
}

