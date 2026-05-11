"use client";

interface QuickEntryProps {
  value: string;
  onChange: (val: string) => void;
}

export default function QuickEntry({ value, onChange }: QuickEntryProps) {
  return (
    <div className="no-print mt-2.5 rounded-xl border-2 border-indigo-500 bg-white overflow-hidden">
      <div className="bg-indigo-500 text-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest">
        ⚡ Quick Entry — Grand Total (VAT Incl.)
      </div>
      <div className="px-3 py-2">
        <input
          type="number"
          inputMode="decimal"
          placeholder="e.g. 4000"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => { const t = e.target; setTimeout(() => t.select(), 0); }}
          className="w-full h-10 px-3 text-base font-bold text-[#1a1a2e] bg-white border border-indigo-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>
    </div>
  );
}
