import { useState } from "react";

export default function Settings() {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const scanLibrary = async () => {
    setIsScanning(true);
    setError(null);

    try {
      const response = await fetch("/api/scan-library", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Scan failed");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to scan library");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col">
      <h1>Settings</h1>

      <button
        onClick={scanLibrary}
        disabled={isScanning}
        className="py-2 w-32 bg-rose-500 rounded disabled:bg-stone-600"
      >
        {isScanning ? "Scanning..." : "Scan Library"}
      </button>

      {error && (
        <div className="mt-4 p-2 bg-rose-950/50 text-rose-500 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-3 bg-stone-800 rounded">
          <p className="font-medium">{result.message}</p>
          <div className="mt-2 text-sm">
            <p>Added: {result.added}</p>
            <p>Removed: {result.removed}</p>
            <p>Total: {result.total}</p>
          </div>
        </div>
      )}
    </div>
  );
}
