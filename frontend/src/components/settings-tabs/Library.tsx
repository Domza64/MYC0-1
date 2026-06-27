import { useState } from "react";
import Button from "../ui/buttons/Button";
import toast from "react-hot-toast";

// TODO: Actually implement this the right way, only show scan to admin, fetch scan progres before showing scan button...
export default function Library() {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scanLibrary = async () => {
    setIsScanning(true);
    setError(null);

    // Replace with web sockets in future for realtime progress updates...
    try {
      const response = await fetch("/api/scan-library", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Scan failed");

      toast("Library Scan started...");
    } catch (err) {
      setError("Failed to scan library");
    } finally {
      setIsScanning(false);
    }
  };
  return (
    <div className="space-y-2">
      <h2>Scan Library</h2>
      <p>Click the button below to start scaning your music library.</p>
      <Button onClick={scanLibrary} disabled={isScanning}>
        <span>{isScanning ? "Scanning..." : "Scan Library"}</span>
      </Button>
      {error && (
        <div className="mt-4 p-2 bg-rose-950/50 text-rose-500 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
