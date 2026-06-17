"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Minus, Plus, User, Mail, CreditCard, Lock } from "lucide-react";

// Updated props to avoid mockData
export interface VoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  nominee: {
    name: string;
    imageUrl: string;
  };
  category: {
    name: string;
  };
  nominationId: string;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

const VOTE_PRICE = 100; // Default UI fallback if API uses something else, or we could fetch it

export default function VoteModal({
  isOpen,
  onClose,
  nominee,
  category,
  nominationId,
}: VoteModalProps) {
  const [voteCount, setVoteCount] = useState<number | "">(1);
  const [voterName, setVoterName] = useState("");
  const [voterEmail, setVoterEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const safeVoteCount = typeof voteCount === "number" ? voteCount : (parseInt(voteCount as string, 10) || 1);
  const totalCost = safeVoteCount * VOTE_PRICE;

  const increment = () => setVoteCount((c) => (typeof c === "number" ? c : (parseInt(c as string, 10) || 1)) + 1);
  const decrement = () => setVoteCount((c) => Math.max((typeof c === "number" ? c : (parseInt(c as string, 10) || 1)) - 1, 1));

  const handlePay = async () => {
    if (!voterName.trim() || !voterEmail.trim()) return;
    setIsLoading(true);
    setError(null);

    if (!nominationId) {
      setError("System error: Missing nomination ID. Please refresh the page.");
      setIsLoading(false);
      return;
    }
    
    if (!voteCount) {
      setError("System error: Vote count is invalid.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        nominationId,
        voterName: voterName.trim(),
        voterEmail: voterEmail.trim(),
        numberOfVotes: safeVoteCount,
      };
      
      // console.log("Sending payload to /api/pay:", payload);

      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment initiation failed");
      }

      if (data.link) {
        window.location.href = data.link; // Redirect to Flutterwave checkout
      } else {
        throw new Error("No payment link returned");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`Vote for ${nominee.name}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Close button */}
        <button
          id="vote-modal-close"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500 z-10"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Nominee header */}
        <div className="flex flex-col items-center pt-8 pb-5 px-6 border-b border-gray-100">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-md mb-3">
            <Image
              src={nominee.imageUrl || "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61"}
              alt={nominee.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <h2 className="font-heading font-bold text-lg text-gray-900 text-center">
            {nominee.name}
          </h2>
          <p className="text-nacos-green font-body text-sm font-medium text-center mt-0.5">
            {category.name}
          </p>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Error display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-body text-center">
              {error}
            </div>
          )}

          {/* Vote stepper */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-center text-xs font-bold font-body tracking-widest text-gray-500 uppercase mb-3">
              Number of Votes
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                id="vote-modal-decrement"
                onClick={decrement}
                disabled={voteCount <= 1}
                className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-nacos-green hover:bg-nacos-green hover:text-white hover:border-nacos-green disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
              >
                <Minus size={18} strokeWidth={2.5} />
              </button>
              <input
                type="number"
                min="1"
                value={voteCount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "") {
                    setVoteCount("");
                  } else {
                    const parsed = parseInt(val, 10);
                    if (!isNaN(parsed) && parsed > 0) {
                      setVoteCount(parsed);
                    }
                  }
                }}
                className="font-heading font-bold text-4xl text-gray-900 w-24 text-center tabular-nums bg-transparent appearance-none m-0 focus:outline-none focus:ring-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                id="vote-modal-increment"
                onClick={increment}
                className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-nacos-green hover:bg-nacos-green hover:text-white hover:border-nacos-green transition-all duration-150"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* Cost display */}
          <div className="flex items-center justify-between bg-nacos-gold/20 border border-nacos-gold/40 rounded-2xl px-5 py-3.5">
            <span className="text-sm font-medium font-body text-gray-700">
              Total Cost:
            </span>
            <span className="font-heading font-bold text-xl text-gray-900">
              {formatCurrency(totalCost)}
            </span>
          </div>

          {/* Voter name */}
          <div className="relative">
            <User
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              id="vote-modal-name"
              type="text"
              placeholder="Your Full Name"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-body text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-nacos-green/30 focus:border-nacos-green transition-all"
            />
          </div>

          {/* Voter email */}
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              id="vote-modal-email"
              type="email"
              placeholder="Your Email Address"
              value={voterEmail}
              onChange={(e) => setVoterEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-body text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-nacos-green/30 focus:border-nacos-green transition-all"
            />
          </div>

          {/* Pay button */}
          <button
            id="vote-modal-pay"
            onClick={handlePay}
            disabled={
              isLoading || !voterName.trim() || !voterEmail.trim()
            }
            className="w-full flex items-center justify-center gap-2.5 bg-nacos-green hover:bg-nacos-dark text-white font-heading font-semibold py-4 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-nacos-green/25"
          >
            <CreditCard size={18} />
            {isLoading ? "Initiating Payment..." : "Pay with Flutterwave"}
          </button>

          {/* Cancel */}
          <button
            onClick={onClose}
            className="w-full text-sm font-body font-medium text-gray-500 hover:text-gray-700 py-2 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Secured footer */}
        <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex items-center justify-center gap-2">
          <Lock size={12} className="text-gray-400" />
          <span className="text-xs text-gray-400 font-body font-semibold uppercase tracking-widest">
            Secured Voting
          </span>
        </div>
      </div>
    </div>
  );
}
