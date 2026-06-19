"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

const formatNaira = (amount: number): string =>
  `₦${amount.toLocaleString("en-NG")}`;

const statusStyles: Record<string, string> = {
  successful: "bg-nacos-green/10 text-nacos-green",
  pending: "bg-amber-50 text-amber-600",
  failed: "bg-red-50 text-red-600",
  cancelled: "bg-gray-100 text-gray-600",
};

export default function TransactionTableClient({ initialRows }: { initialRows: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRows = initialRows.filter((txn) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      txn.voter_email?.toLowerCase().includes(term) ||
      txn.tx_ref?.toLowerCase().includes(term)
    );
  });

  const handleDownloadCsv = () => {
    const headers = ["Voter Name", "Voter Email", "Nominee", "Votes", "Amount", "Status", "Reference", "Date"];
    const rows = filteredRows.map(txn => [
      `"${txn.voter_name || ''}"`,
      `"${txn.voter_email || ''}"`,
      `"${txn.nominations?.contestants?.name || ''}"`,
      txn.number_of_votes || 0,
      txn.amount || 0,
      `"${txn.status || ''}"`,
      `"${txn.tx_ref || ''}"`,
      `"${new Date(txn.created_at).toISOString()}"`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "nacos_transactions.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 pt-5 pb-3">
        <div>
          <h2 className="font-heading font-bold text-gray-900 text-[15px]">
            Recent Transactions
          </h2>
          <p className="text-xs text-gray-400 font-body mt-0.5">
            Live Flutterwave payments
          </p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email or ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm font-body text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-nacos-green transition-all"
            />
          </div>
          <button
            onClick={handleDownloadCsv}
            className="hidden sm:flex text-sm items-center gap-2 font-body font-semibold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Download CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-gray-50">
              <th className="text-left px-5 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">
                Voter
              </th>
              <th className="text-left px-5 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">
                Nominee
              </th>
              <th className="text-right px-5 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">
                Votes
              </th>
              <th className="text-right px-5 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-center px-5 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="text-right px-5 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">
                Reference
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center">
                  <p className="text-gray-400 font-body text-sm">
                    {searchTerm ? "No results found for your search." : "No transactions recorded yet."}
                  </p>
                </td>
              </tr>
            ) : (
              filteredRows.map((txn: any) => {
                const nomineeName =
                  txn.nominations?.contestants?.name || "Unknown";
                const initials = txn.voter_name
                  ? (txn.voter_name.split(" ")[0]?.[0] || "") +
                    (txn.voter_name.split(" ")[1]?.[0] || "")
                  : "?";
                const badgeStyle =
                  statusStyles[txn.status] || "bg-gray-100 text-gray-600";

                return (
                  <tr
                    key={txn.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    {/* Voter */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold font-heading text-gray-600">
                            {initials.toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-body font-medium text-gray-800 text-[13px] truncate">
                            {txn.voter_name}
                          </p>
                          <p className="text-[11px] text-gray-400 font-body truncate">
                            {txn.voter_email}
                          </p>
                        </div>
                      </div>
                    </td>
                    {/* Nominee */}
                    <td className="px-5 py-4">
                      <span className="font-body text-[13px] text-gray-700">
                        {nomineeName}
                      </span>
                    </td>
                    {/* Votes */}
                    <td className="px-5 py-4 text-right">
                      <span className="font-heading font-bold text-gray-900 text-[13px]">
                        {txn.number_of_votes}
                      </span>
                    </td>
                    {/* Amount */}
                    <td className="px-5 py-4 text-right">
                      <span className="font-heading font-bold text-gray-900 text-[13px]">
                        {formatNaira(txn.amount || 0)}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-5 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold font-body uppercase tracking-wider ${badgeStyle}`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    {/* Reference */}
                    <td className="px-5 py-4 text-right">
                      <span className="font-body text-xs text-gray-400 tabular-nums">
                        {txn.tx_ref}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
