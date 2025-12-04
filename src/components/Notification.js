"use client";

export default function Notification({ message, variant = "success" }) {
  if (!message) return null;

  const isDanger = variant === "danger";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
      <div
        className={`pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white shadow-lg ${
          isDanger ? "bg-red-600 shadow-red-900/30" : "bg-slate-900 shadow-slate-900/20"
        }`}
      >
        <span
          className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
            isDanger ? "bg-white/10" : "bg-emerald-500"
          }`}
        >
          {isDanger ? "!" : "✓"}
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
}
