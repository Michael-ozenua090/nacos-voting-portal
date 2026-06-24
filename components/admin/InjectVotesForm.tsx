"use client";

import { useState } from "react";
import { Zap, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { injectDummyVotes } from "@/app/admin/actions/injectDummyVotes";

interface InjectVotesFormProps {
  nominationId: string;
  nomineeName: string;
  /** Called after a successful injection so the parent can refresh its list */
  onSuccess?: () => void;
}

export default function InjectVotesForm({
  nominationId,
  nomineeName,
  onSuccess,
}: InjectVotesFormProps) {
  const [voteCount, setVoteCount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleInject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (voteCount < 1) return;

    const confirmed = window.confirm(
      `⚠️ You are about to inject ${voteCount} DUMMY vote(s) for "${nomineeName}".\n\nThis action is logged and irreversible. Continue?`
    );
    if (!confirmed) return;

    setIsLoading(true);
    setFeedback(null);

    const result = await injectDummyVotes(nominationId, voteCount);

    setIsLoading(false);

    if (result.success) {
      setFeedback({ type: "success", text: result.message ?? "Done!" });
      setVoteCount(10);
      onSuccess?.();
    } else {
      setFeedback({ type: "error", text: result.error ?? "Failed." });
    }
  };

  return (
    <div className="mt-2 rounded-xl border border-orange-200 bg-orange-50/60 p-3 space-y-2">
      {/* Header badge */}
      <div className="flex items-center gap-1.5">
        <Zap size={12} className="text-orange-500 fill-orange-500" />
        <span className="text-[10px] font-bold font-body text-orange-600 uppercase tracking-widest">
          Dummy Vote Injection
        </span>
      </div>

      <form onSubmit={handleInject} className="flex items-center gap-2">
        <input
          id={`inject-votes-${nominationId}`}
          type="number"
          min={1}
          max={10000}
          value={voteCount}
          onChange={(e) => setVoteCount(Number(e.target.value))}
          disabled={isLoading}
          className="
            w-20 px-3 py-1.5 rounded-lg border border-orange-300 bg-white
            text-sm font-heading font-bold text-gray-800
            focus:outline-none focus:ring-2 focus:ring-orange-400/50
            disabled:opacity-60
          "
        />
        <button
          type="submit"
          disabled={isLoading || voteCount < 1}
          className="
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            bg-orange-500 hover:bg-orange-600 active:scale-95
            text-white text-xs font-heading font-bold
            transition-all duration-150 shadow-sm shadow-orange-400/30
            disabled:opacity-60 disabled:cursor-not-allowed
          "
        >
          {isLoading ? (
            <>
              <Loader2 size={12} className="animate-spin" />
              Injecting...
            </>
          ) : (
            <>
              <Zap size={12} className="fill-white" />
              Inject
            </>
          )}
        </button>
      </form>

      {/* Inline feedback message */}
      {feedback && (
        <div
          className={`flex items-center gap-1.5 text-[11px] font-body font-medium ${
            feedback.type === "success" ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 size={12} className="flex-shrink-0" />
          ) : (
            <AlertTriangle size={12} className="flex-shrink-0" />
          )}
          {feedback.text}
        </div>
      )}
    </div>
  );
}
