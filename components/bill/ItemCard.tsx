"use client";

import { fmt } from "@/lib/calculations";
import type { BillItem } from "@/types";

interface ItemCardProps {
  item: BillItem;
  index: number;
  onRemove: () => void;
  onChange: (updated: Partial<BillItem>) => void;
}

export default function ItemCard({ item, index, onRemove, onChange }: ItemCardProps) {
  const sp = parseFloat(String(item.sellPrice)) || 0;
  const lineAmt = item.qty * (sp / 1.13);

  return (
    <div className="border border-[#e8eaf0] rounded-xl mb-2 overflow-hidden">
      {/* Header */}
      <div className="bg-[#f0f2ff] flex items-center justify-between px-3 py-1.5">
        <span className="text-[12px] font-bold text-[#3a3f7a]">Item {index + 1}</span>
        <button
          onClick={onRemove}
          className="bg-red-100 text-red-500 text-[11px] font-semibold px-2 py-0.5 rounded-md hover:bg-red-200 transition-colors"
        >
          ✕ Remove
        </button>
      </div>

      {/* Body */}
      <div className="p-2.5 grid grid-cols-2 gap-2">
        {/* Particulars */}
        <div className="col-span-2 flex flex-col gap-1">
          <Label>Description / Particulars</Label>
          <input
            type="text"
            value={item.particulars}
            onChange={(e) => onChange({ particulars: e.target.value })}
            placeholder="e.g. Kurtha Set"
            autoComplete="off"
            className={inputCls}
          />
        </div>

        {/* HS Code */}
        <div className="flex flex-col gap-1">
          <Label>HS Code</Label>
          <input
            type="text"
            value={item.hsCode}
            onChange={(e) => onChange({ hsCode: e.target.value })}
            placeholder="62041900"
            inputMode="numeric"
            className={inputCls}
          />
        </div>

        {/* Qty */}
        <div className="flex flex-col gap-1">
          <Label>Qty</Label>
          <input
            type="number"
            min={1}
            value={item.qty}
            onChange={(e) => onChange({ qty: parseFloat(e.target.value) || 1 })}
            onFocus={(e) => { const t = e.target; setTimeout(() => t.select(), 0); }}
            inputMode="numeric"
            className={`${inputCls} text-center`}
          />
        </div>

        {/* Incl/Excl VAT inputs */}
        <div className="col-span-2 flex gap-2">
          <div className="flex-1 bg-indigo-50 border border-indigo-200 rounded-lg px-2.5 pt-1.5 pb-2 focus-within:border-indigo-400 focus-within:ring-1 focus-within:ring-indigo-100 transition-all">
            <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-wide mb-0.5">Incl. VAT</p>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-indigo-400">Rs.</span>
              <input
                type="number"
                min={0}
                value={item.sellPrice === '' ? '' : item.sellPrice}
                onChange={(e) => onChange({ sellPrice: e.target.value })}
                onFocus={(e) => { const t = e.target; setTimeout(() => t.select(), 0); }}
                placeholder="0"
                inputMode="decimal"
                className="w-full bg-transparent text-[13px] font-bold text-indigo-700 outline-none placeholder:text-indigo-300"
              />
            </div>
          </div>

          <div className="flex-1 bg-orange-50 border border-orange-200 rounded-lg px-2.5 pt-1.5 pb-2 focus-within:border-orange-400 focus-within:ring-1 focus-within:ring-orange-100 transition-all">
            <p className="text-[9px] font-bold text-orange-400 uppercase tracking-wide mb-0.5">Excl. VAT</p>
            <div className="flex items-center gap-1">
              <span className="text-[11px] text-orange-400">Rs.</span>
              <input
                type="number"
                min={0}
                value={sp > 0 ? parseFloat((sp / 1.13).toFixed(2)) : ''}
                onChange={(e) => {
                  const excl = parseFloat(e.target.value) || 0;
                  onChange({ sellPrice: excl > 0 ? parseFloat((excl * 1.13).toFixed(2)) : '' });
                }}
                onFocus={(e) => { const t = e.target; setTimeout(() => t.select(), 0); }}
                placeholder="0"
                inputMode="decimal"
                className="w-full bg-transparent text-[13px] font-bold text-orange-700 outline-none placeholder:text-orange-300"
              />
            </div>
          </div>
        </div>

        {/* Line Total */}
        <div className="col-span-2 bg-gray-50 rounded-lg px-3 py-1.5 flex justify-between items-center">
          <span className="text-[11px] text-gray-500">Line Total (pre-VAT)</span>
          <span className="text-[12px] font-bold text-green-600">
            {lineAmt > 0 ? `Rs. ${fmt(lineAmt)}` : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.4px]">
      {children}
    </label>
  );
}

const inputCls =
  "h-9 px-2.5 text-[13px] text-[#111] bg-white border border-[#dde] rounded-lg outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 w-full";
