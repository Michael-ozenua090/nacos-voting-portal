import Link from "next/link";
import { transactions, formatCurrency } from "@/lib/mockData";

export default function TransactionTable() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-3">
        <div>
          <h2 className="font-heading font-bold text-gray-900 text-[15px]">
            Recent Transactions
          </h2>
          <p className="text-xs text-gray-400 font-body mt-0.5">
            Live Flutterwave payments
          </p>
        </div>
        <Link
          href="#"
          className="text-sm font-body font-semibold text-nacos-green hover:text-nacos-dark transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-gray-50">
              <th className="text-left px-5 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">
                Student Name
              </th>
              <th className="text-right px-5 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-right px-5 py-3 text-xs font-bold font-body text-gray-400 uppercase tracking-wider">
                Reference
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((txn) => (
              <tr
                key={txn.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                {/* Student */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold font-heading text-gray-600">
                        {txn.initials}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-body font-medium text-gray-800 text-[13px] truncate">
                        {txn.studentName}
                      </p>
                      <p className="text-[11px] text-gray-400 font-body truncate">
                        {txn.categoryName}
                      </p>
                    </div>
                  </div>
                </td>
                {/* Amount */}
                <td className="px-5 py-4 text-right">
                  <span className="font-heading font-bold text-gray-900 text-[13px]">
                    {formatCurrency(txn.amount)}
                  </span>
                </td>
                {/* Reference */}
                <td className="px-5 py-4 text-right">
                  <span className="font-body text-xs text-gray-400 tabular-nums">
                    {txn.reference}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
