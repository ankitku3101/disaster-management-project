"use client";
import { useEffect, useState } from "react";
import { getSafetyTips } from "@/services/getSafetyTips";
import { Loader2, ShieldCheck } from "lucide-react";

interface Tip {
  id: number;
  tip: string;
}

export default function SafetyTips() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTips() {
      const data = await getSafetyTips();
      setTips(data);
      setLoading(false);
    }
    fetchTips();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <ShieldCheck className="text-green-500" /> Safety Tips
      </h2>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="animate-spin" /> Loading safety tips...
        </div>
      ) : tips.length === 0 ? (
        <p className="text-gray-500">No safety tips available.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {tips.map((tip) => (
            <div
              key={tip.id}
              className="bg-green-50 border border-green-300 rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <p className="text-sm text-gray-800">{tip.tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
