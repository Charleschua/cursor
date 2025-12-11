"use client";

import { useEffect, useMemo, useState } from "react";

const emptyForm = { name: "", type: "dev" };
const maskKey = (key) => `${key.slice(0, 4)}••••••••••••••••`;

export default function ApiKeysSection({ onNotify }) {
  const [keys, setKeys] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState("all");
  const [visibleKeyIds, setVisibleKeyIds] = useState(new Set());
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [editingKeyId, setEditingKeyId] = useState(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    const loadKeys = async () => {
      try {
        const response = await fetch("/api/keys");
        if (!response.ok) {
          console.error("Failed to fetch keys");
          return;
        }
        const data = await response.json();
        setKeys(data);
      } catch (error) {
        console.error("Error loading keys:", error);
      }
    };

    loadKeys();
  }, []);

  const visibleKeys = useMemo(() => {
    if (filter === "all") return keys;
    return keys.filter((key) => key.type === filter);
  }, [keys, filter]);

  const handleCreateKey = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;

    const create = async () => {
      try {
        const response = await fetch("/api/keys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name.trim(), type: form.type }),
        });

        if (!response.ok) {
          console.error("Failed to create key");
          return;
        }

        const created = await response.json();
        setKeys((prev) => [created, ...prev]);
        setForm(emptyForm);
        onNotify?.("API key created", "success");
      } catch (error) {
        console.error("Error creating key:", error);
      }
    };

    create();
  };

  const handleDeleteKey = async (id) => {
    try {
      const response = await fetch(`/api/keys/${id}`, { method: "DELETE" });
      if (!response.ok) {
        console.error("Failed to delete key");
        return;
      }
      setKeys((prev) => prev.filter((key) => key.id !== id));
      onNotify?.("API key deleted", "danger");
    } catch (error) {
      console.error("Error deleting key:", error);
    }
  };

  const toggleKeyVisibility = (id) => {
    setVisibleKeyIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleCopyKey = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedKeyId(id);
      setTimeout(() => setCopiedKeyId(null), 1500);
      onNotify?.("API key copied to clipboard", "success");
    } catch (error) {
      console.error("Failed to copy key to clipboard:", error);
    }
  };

  const startEditingKey = (key) => {
    setEditingKeyId(key.id);
    setEditingName(key.name);
  };

  const cancelEditingKey = () => {
    setEditingKeyId(null);
    setEditingName("");
  };

  const saveEditingKey = async () => {
    const key = keys.find((k) => k.id === editingKeyId);
    if (!key) return;

    const trimmed = editingName.trim();
    if (!trimmed || trimmed === key.name) {
      cancelEditingKey();
      return;
    }

    try {
      const response = await fetch(`/api/keys/${key.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });

      if (!response.ok) {
        console.error("Failed to update key");
        return;
      }

      const updated = await response.json();
      setKeys((prev) => prev.map((k) => (k.id === key.id ? updated : k)));
      cancelEditingKey();
      onNotify?.("API key updated", "success");
    } catch (error) {
      console.error("Error updating key:", error);
    }
  };

  return (
    <article className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
      <header className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-500">API Keys</p>
          <p className="text-xs text-slate-400 mt-0.5">Authenticate against the Research API</p>
        </div>
        <div className="flex gap-2 text-xs">
          <button 
            className={`rounded-full border px-3 py-1.5 sm:py-1 transition-colors ${
              filter === "all" ? "bg-slate-900 text-white border-slate-900" : "hover:bg-slate-50"
            }`} 
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button 
            className={`rounded-full border px-3 py-1.5 sm:py-1 transition-colors ${
              filter === "dev" ? "bg-slate-900 text-white border-slate-900" : "hover:bg-slate-50"
            }`} 
            onClick={() => setFilter("dev")}
          >
            Dev
          </button>
          <button 
            className={`rounded-full border px-3 py-1.5 sm:py-1 transition-colors ${
              filter === "prod" ? "bg-slate-900 text-white border-slate-900" : "hover:bg-slate-50"
            }`} 
            onClick={() => setFilter("prod")}
          >
            Prod
          </button>
        </div>
      </header>

      <div className="mt-4 sm:mt-6 divide-y divide-slate-100 rounded-xl sm:rounded-2xl border border-slate-100">
        {visibleKeys.map((key) => {
          const isVisible = visibleKeyIds.has(key.id);
          return (
            <div
              key={key.id}
              className={`px-3 sm:px-4 py-3 sm:py-4 ${
                editingKeyId === key.id 
                  ? "bg-slate-50/50 rounded-lg" 
                  : ""
              }`}
            >
              {editingKeyId === key.id ? (
                // Edit mode: full-width edit form
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">
                      Key Name
                    </label>
                    <input
                      className="w-full rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                      value={editingName}
                      onChange={(event) => setEditingName(event.target.value)}
                      autoFocus
                      placeholder="Enter key name"
                    />
                  </div>
                  <div className="flex gap-2 sm:flex-col sm:justify-end">
                    <button
                      type="button"
                      className="flex-1 sm:flex-none rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors shadow-sm"
                      onClick={saveEditingKey}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="flex-1 sm:flex-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      onClick={cancelEditingKey}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View mode: standard layout
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold capitalize text-sm sm:text-base text-slate-900">{key.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{key.type}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 min-w-0">
                    <p className="font-mono text-xs sm:text-sm text-slate-700 truncate flex-1 sm:flex-none min-w-0 max-w-[200px] sm:max-w-none">
                      {isVisible ? key.id : maskKey(key.id)}
                    </p>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-slate-500 flex-shrink-0">
                      <button
                        type="button"
                        className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-slate-200 hover:border-slate-400 hover:text-slate-700 transition-colors touch-manipulation bg-white"
                        onClick={() => toggleKeyVisibility(key.id)}
                        aria-label={isVisible ? "Hide API key" : "Show API key"}
                      >
                        {/* Eye icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        >
                          <path d="M2.5 12S5.5 6.5 12 6.5 21.5 12 21.5 12 18.5 17.5 12 17.5 2.5 12 2.5 12Z" />
                          <circle cx="12" cy="12" r="2.75" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-slate-200 hover:border-slate-400 hover:text-slate-700 transition-colors touch-manipulation bg-white"
                        onClick={() => handleCopyKey(key.id)}
                        aria-label="Copy API key"
                      >
                        {/* Clipboard icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        >
                          <rect x="9" y="4" width="11" height="16" rx="2" />
                          <rect x="4" y="4" width="9" height="4" rx="1.5" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-slate-200 hover:border-slate-400 hover:text-slate-700 transition-colors touch-manipulation bg-white"
                        onClick={() => startEditingKey(key)}
                        aria-label="Edit API key name"
                      >
                        {/* Pencil icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        >
                          <path d="M5 19l1.2-4.8L15.4 5l3.6 3.6-9.2 9.2L5 19Z" />
                          <path d="M13.5 6.5 17 10" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-slate-200 text-red-400 hover:border-red-400 hover:text-red-500 transition-colors touch-manipulation bg-white"
                        onClick={() => handleDeleteKey(key.id)}
                        aria-label="Delete API key"
                      >
                        {/* Trash icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.7"
                        >
                          <path d="M5 8h14" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 4h6l1 2H8l1-2Z" />
                          <path d="M7 8h10l-.7 9.2A2 2 0 0 1 14.3 19H9.7a2 2 0 0 1-1.99-1.8L7 8Z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-slate-500 sm:ml-auto">
                    <span>{key.usage} credits</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {visibleKeys.length === 0 && (
          <div className="px-3 sm:px-4 py-6 sm:py-8 text-center text-sm text-slate-400">
            No keys under this filter.
          </div>
        )}
      </div>

      <form
        onSubmit={handleCreateKey}
        className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 rounded-xl sm:rounded-2xl bg-slate-50 p-4"
      >
        <input
          className="flex-1 rounded-xl sm:rounded-2xl border border-slate-200 px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-slate-400"
          placeholder="Key name (e.g. default)"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        />
        <select
          className="rounded-xl sm:rounded-2xl border border-slate-200 px-4 py-2.5 sm:py-3 text-sm"
          value={form.type}
          onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
        >
          <option value="dev">dev</option>
          <option value="prod">prod</option>
        </select>
        <button
          className="rounded-xl sm:rounded-2xl bg-slate-900 px-4 py-2.5 sm:py-3 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
          type="submit"
        >
          Generate Key
        </button>
      </form>
    </article>
  );
}


