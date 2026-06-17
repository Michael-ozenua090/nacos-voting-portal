"use client";

import { useState, useEffect } from "react";
import { Settings, Save, AlertTriangle, CheckCircle2, Radio } from "lucide-react";
import TopAppBar from "@/components/layout/TopAppBar";
import Footer from "@/components/layout/Footer";
import { createClient } from "@/utils/supabase/client";

export default function AdminSettingsPage() {
  const supabase = createClient();
  
  // Settings State
  const [isVotingOpen, setIsVotingOpen] = useState(false);
  const [votePrice, setVotePrice] = useState(100);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("system_settings")
        .select("*")
        .limit(1)
        .single();

      if (data) {
        setIsVotingOpen(data.voting_open ?? false);
        setVotePrice(data.vote_price_naira ?? 100);
        setSettingsId(data.id);
      } else if (error) {
        setMessage({ type: "error", text: "Failed to load system settings." });
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSaving(true);

    let error;

    if (settingsId) {
      // Update existing row
      const { error: updateError } = await supabase
        .from("system_settings")
        .update({
          voting_open: isVotingOpen,
          vote_price_naira: votePrice,
        })
        .eq("id", settingsId);
      error = updateError;
    } else {
      // Fallback if table was completely empty for some reason
      const { error: insertError } = await supabase
        .from("system_settings")
        .insert([{ voting_open: isVotingOpen, vote_price_naira: votePrice }]);
      error = insertError;
    }

    setIsSaving(false);

    if (error) {
      setMessage({ type: "error", text: `Update failed: ${error.message}` });
    } else {
      setMessage({ type: "success", text: "System settings updated successfully." });
    }
  };

  return (
    <>
      <TopAppBar isAdmin />
      <main className=" max-w-2xl lg:max-w-4xl mx-auto px-4 pt-4">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl text-gray-900">
            System Settings
          </h1>
          <p className="text-gray-400 font-body text-sm mt-0.5">
            Configure global voting parameters and platform status.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <Settings size={16} className="text-gray-600" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-lg text-gray-900">
                Global Configuration
              </h2>
            </div>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-gray-400 text-sm font-body">
              Loading configuration...
            </div>
          ) : (
            <>
              {message && (
                <div
                  className={`mb-6 px-4 py-3 rounded-xl border flex items-center gap-2 text-sm font-body ${
                    message.type === "success"
                      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                      : "bg-red-50 border-red-100 text-red-600"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle2 size={16} className="flex-shrink-0" />
                  ) : (
                    <AlertTriangle size={16} className="flex-shrink-0" />
                  )}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-8">
                {/* Voting Status Toggle */}
                <div>
                  <label className="block text-xs font-bold font-body uppercase tracking-widest text-gray-700 mb-3">
                    Voting Status
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Live Option */}
                    <label
                      className={`relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all ${
                        isVotingOpen
                          ? "border-nacos-green bg-nacos-green/5"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="votingStatus"
                        checked={isVotingOpen}
                        onChange={() => setIsVotingOpen(true)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                            isVotingOpen ? "border-nacos-green" : "border-gray-300"
                          }`}
                        >
                          {isVotingOpen && <div className="w-2.5 h-2.5 rounded-full bg-nacos-green" />}
                        </div>
                        <div>
                          <p className={`font-heading font-bold text-[15px] ${isVotingOpen ? "text-gray-900" : "text-gray-700"}`}>
                            Live / Open
                          </p>
                          <p className="text-xs text-gray-500 font-body mt-0.5">
                            Users can actively pay and cast votes.
                          </p>
                        </div>
                      </div>
                      {isVotingOpen && (
                        <div className="absolute top-4 right-4 flex items-center justify-center">
                          <Radio size={16} className="text-nacos-green animate-pulse" />
                        </div>
                      )}
                    </label>

                    {/* Paused Option */}
                    <label
                      className={`relative flex items-center p-4 cursor-pointer rounded-xl border-2 transition-all ${
                        !isVotingOpen
                          ? "border-red-500 bg-red-50/50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="votingStatus"
                        checked={!isVotingOpen}
                        onChange={() => setIsVotingOpen(false)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                            !isVotingOpen ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          {!isVotingOpen && <div className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                        </div>
                        <div>
                          <p className={`font-heading font-bold text-[15px] ${!isVotingOpen ? "text-red-900" : "text-gray-700"}`}>
                            Closed / Paused
                          </p>
                          <p className="text-xs text-gray-500 font-body mt-0.5">
                            Voting is frozen. No new payments allowed.
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Vote Price */}
                <div>
                  <label htmlFor="votePrice" className="block text-xs font-bold font-body uppercase tracking-widest text-gray-700 mb-2">
                    Vote Price (₦)
                  </label>
                  <p className="text-xs text-gray-400 font-body mb-3">
                    The flat cost per single vote cast through Flutterwave.
                  </p>
                  <div className="relative max-w-xs">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold font-heading">
                      ₦
                    </span>
                    <input
                      id="votePrice"
                      type="number"
                      min="10"
                      step="10"
                      value={votePrice}
                      onChange={(e) => setVotePrice(Number(e.target.value))}
                      required
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all font-bold"
                      style={{ '--tw-ring-color': 'rgba(0,135,81,0.3)' } as React.CSSProperties}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-gray-50">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 bg-nacos-green hover:bg-nacos-dark text-white font-heading font-semibold py-3.5 px-8 rounded-xl text-sm transition-all duration-200 shadow-md shadow-nacos-green/25 disabled:opacity-60 disabled:cursor-not-allowed max-w-xs"
                  >
                    <Save size={16} />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
