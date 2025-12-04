"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Notification from "@/components/Notification";

function ProtectedContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [apiKey, setApiKey] = useState("");
  const [validating, setValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const key = searchParams.get("key");
    
    if (!key) {
      setValidating(false);
      setIsValid(false);
      setToastVariant("danger");
      setToastMessage("Invalid API key");
      setTimeout(() => setToastMessage(""), 1800);
      return;
    }

    setApiKey(key);
    validateApiKey(key);
  }, [searchParams]);

  const validateApiKey = async (key) => {
    try {
      const response = await fetch("/api/keys/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      });

      const data = await response.json();

      if (data.valid) {
        setIsValid(true);
        setToastVariant("success");
        setToastMessage("Valid API key, /protected can be accessed");
      } else {
        setIsValid(false);
        setToastVariant("danger");
        setToastMessage("Invalid API key");
      }
    } catch (error) {
      console.error("Error validating API key:", error);
      setIsValid(false);
      setToastVariant("danger");
      setToastMessage("Invalid API key");
    } finally {
      setValidating(false);
      setTimeout(() => setToastMessage(""), 1800);
    }
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
              <h1 className="text-4xl font-semibold">Protected Page</h1>
              <p className="mt-2 text-sm text-slate-600">
                This page requires a valid API key to access
              </p>
            </div>
          </div>

          <article className="rounded-3xl bg-white p-6 shadow-sm">
            {validating ? (
              <div className="text-center py-8">
                <p className="text-sm text-slate-500">Validating API key...</p>
              </div>
            ) : isValid ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
                  <p className="text-sm font-medium text-emerald-700">
                    ✓ Access granted! Your API key is valid.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-slate-700">Protected Content</p>
                  <p className="text-sm text-slate-600">
                    You have successfully validated your API key and can now access this protected area.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    ✗ Access denied. Invalid API key.
                  </p>
                </div>
                <button
                  onClick={() => router.push("/playground")}
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
                >
                  Go to Playground
                </button>
              </div>
            )}
          </article>
        </main>
      </div>

      <Notification message={toastMessage} variant={toastVariant} />
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f7f8fb] flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    }>
      <ProtectedContent />
    </Suspense>
  );
}

