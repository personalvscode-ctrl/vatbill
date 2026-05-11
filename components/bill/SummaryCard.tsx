"use client";

import { fmt } from "@/lib/calculations";
import { amountInWords } from "@/lib/numToWords";
import type { BillTotals } from "@/types";

export default function SummaryCard({ totals }: { totals: BillTotals }) {
  const { subTotal, discAmt, discPct, taxable, vat13, grandTotal } = totals;
  const rs = (n: number) => (n > 0 ? `Rs. ${fmt(n)}` : '—');
  const discLabel = discPct > 0 ? `Discount (${parseFloat(discPct.toFixed(2))}%)` : 'Discount';

  return (
    <div className="no-print mt-2.5 bg-[#1a1a2e] text-white rounded-xl px-4 py-3">
      <Row label="Sub Total (pre-VAT)" value={rs(subTotal)} />
      <Row label={discLabel} value={discAmt > 0 ? `– Rs. ${fmt(discAmt)}` : '—'} />
      <Row label="Taxable Value" value={rs(taxable)} />
      <Row label="13% VAT" value={rs(vat13)} />

      <div className="flex justify-between items-center pt-2 mt-0.5">
        <span className="text-[15px] font-black text-[#7ef7a0]">Grand Total</span>
        <span className="text-[15px] font-black text-[#7ef7a0]">
          {grandTotal > 0 ? `Rs. ${fmt(grandTotal)}` : 'Rs. —'}
        </span>
      </div>

      {grandTotal > 0 && (
        <p className="text-[10px] text-[#99b] mt-2 pt-2 border-t border-white/10 italic leading-relaxed">
          {amountInWords(grandTotal)}
        </p>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-white/[0.08]">
      <span className="text-[11px] text-[#aab]">{label}</span>
      <span className="text-[12px] font-semibold">{value}</span>
    </div>
  );
}
