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
    <article className="rounded-3xl bg-white p-6 shadow-sm">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">API Keys</p>
          <p className="text-xs text-slate-400">Authenticate against the Research API</p>
        </div>
        <div className="flex gap-2 text-xs">
          <button className="rounded-full border px-3 py-1" onClick={() => setFilter("all")}>
            All
          </button>
          <button className="rounded-full border px-3 py-1" onClick={() => setFilter("dev")}>
            Dev
          </button>
          <button className="rounded-full border px-3 py-1" onClick={() => setFilter("prod")}>
            Prod
          </button>
        </div>
      </header>

      <div className="mt-6 divide-y divide-slate-100 rounded-2xl border border-slate-100">
        {visibleKeys.map((key) => {
          const isVisible = visibleKeyIds.has(key.id);
          return (
            <div
              key={key.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-4"
            >
              <div className="min-w-0">
                {editingKeyId === key.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      className="w-40 flex-1 rounded-xl border border-slate-200 px-2 py-1 text-sm outline-none focus:border-slate-400"
                      value={editingName}
                      onChange={(event) => setEditingName(event.target.value)}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="rounded-xl bg-slate-900 px-2 py-1 text-xs font-semibold text-white"
                      onClick={saveEditingKey}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="rounded-xl px-2 py-1 text-xs text-slate-500 hover:text-slate-700"
                      onClick={cancelEditingKey}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="truncate font-semibold capitalize">{key.name}</p>
                    <p className="text-xs text-slate-500">{key.type}</p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-3">
                <p className="font-mono text-sm text-slate-700">
                  {isVisible ? key.id : maskKey(key.id)}
                </p>
                <div className="flex items-center gap-2 text-slate-500">
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 hover:border-slate-400 hover:text-slate-700"
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
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 hover:border-slate-400 hover:text-slate-700"
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
                  {editingKeyId !== key.id && (
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 hover:border-slate-400 hover:text-slate-700"
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
                  )}
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-red-400 hover:border-red-400 hover:text-red-500"
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
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>{key.usage} credits</span>
              </div>
            </div>
          );
        })}
        {visibleKeys.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-slate-400">
            No keys under this filter.
          </div>
        )}
      </div>

      <form
        onSubmit={handleCreateKey}
        className="mt-6 flex flex-wrap gap-3 rounded-2xl bg-slate-50 p-4"
      >
        <input
          className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-slate-400"
          placeholder="Key name (e.g. default)"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        />
        <select
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          value={form.type}
          onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
        >
          <option value="dev">dev</option>
          <option value="prod">prod</option>
        </select>
        <button
          className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          type="submit"
        >
          Generate Key
        </button>
      </form>
    </article>
  );
}


