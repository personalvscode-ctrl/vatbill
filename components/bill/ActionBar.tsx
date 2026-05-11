"use client";

export default function ActionBar({ onReset }: { onReset: () => void }) {
  return (
    <div className="no-print fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-100 px-3 py-2 flex gap-2 z-50 shadow-[0_-2px_8px_rgba(0,0,0,.08)] sm:static sm:bg-transparent sm:backdrop-blur-none sm:border-none sm:py-4 sm:max-w-[660px] sm:mx-auto sm:px-0">
      <button
        onClick={onReset}
        className="px-4 h-10 text-[13px] font-semibold text-gray-500 bg-[#f2f4f7] border border-[#dde] rounded-xl hover:bg-[#e5e8ef] transition-colors"
      >
        ↺ Reset
      </button>
      <button
        onClick={() => window.print()}
        className="flex-1 h-10 text-[14px] font-bold text-white bg-[#1a5fb4] rounded-xl hover:bg-[#1450a0] transition-colors"
      >
        🖨 Print Bill
      </button>
    </div>
  );
}
