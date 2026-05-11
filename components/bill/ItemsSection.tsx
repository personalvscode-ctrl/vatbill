"use client";

import ItemCard from "./ItemCard";
import type { BillItem } from "@/types";

interface ItemsSectionProps {
  items: BillItem[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChange: (id: string, updated: Partial<BillItem>) => void;
}

export default function ItemsSection({ items, onAdd, onRemove, onChange }: ItemsSectionProps) {
  return (
    <div className="no-print mt-2.5 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gray-50 border-b border-gray-100 px-3 py-2">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Items</span>
      </div>
      <div className="p-2.5">
        {items.map((item, i) => (
          <ItemCard
            key={item.id}
            item={item}
            index={i}
            onRemove={() => onRemove(item.id)}
            onChange={(updated) => onChange(item.id, updated)}
          />
        ))}
        <button
          onClick={onAdd}
          className="w-full h-9 text-[12px] font-semibold text-green-700 bg-green-50 border border-dashed border-green-300 rounded-xl hover:bg-green-100 transition-colors"
        >
          + Add Item
        </button>
      </div>
    </div>
  );
}
