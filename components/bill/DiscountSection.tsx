"use client";

interface DiscountSectionProps {
  discountPct: string;
  discountAmt: string;
  onPctChange: (val: string) => void;
  onAmtChange: (val: string) => void;
}

const inputCls =
  "h-9 flex-1 min-w-0 px-2.5 text-[13px] text-[#111] bg-white border border-[#dde] rounded-lg outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100";

export default function DiscountSection({ discountPct, discountAmt, onPctChange, onAmtChange }: DiscountSectionProps) {
  return (
    <div className="no-print mt-2.5 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-100 px-3 py-2">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Discount</span>
      </div>
      <div className="px-3 py-2.5 flex items-center gap-2">
        <div className="flex items-center gap-1.5 flex-1">
          <label className="text-[12px] font-semibold text-gray-600 shrink-0">%</label>
          <input
            type="number"
            min={0}
            max={100}
            step={0.01}
            value={discountPct}
            onChange={(e) => onPctChange(e.target.value)}
            placeholder="0"
            inputMode="decimal"
            className={inputCls}
          />
          <span className="text-[12px] font-semibold text-gray-500 shrink-0">%</span>
        </div>

        <span className="text-[10px] text-gray-300 font-semibold shrink-0">— OR —</span>

        <div className="flex items-center gap-1.5 flex-1">
          <label className="text-[12px] font-semibold text-gray-600 shrink-0">Rs.</label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={discountAmt}
            onChange={(e) => onAmtChange(e.target.value)}
            placeholder="0"
            inputMode="decimal"
            className={inputCls}
          />
          <span className="text-[9px] text-gray-400 shrink-0 hidden xs:inline">VAT incl.</span>
        </div>
      </div>
    </div>
  );
}
