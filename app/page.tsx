"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import TopBar from "@/components/bill/TopBar";
import QuickEntry from "@/components/bill/QuickEntry";
import ItemsSection from "@/components/bill/ItemsSection";
import DiscountSection from "@/components/bill/DiscountSection";
import SummaryCard from "@/components/bill/SummaryCard";
import BillPreview from "@/components/bill/BillPreview";
import ActionBar from "@/components/bill/ActionBar";

import { calcTotals, getSubTotal } from "@/lib/calculations";
import type { BillItem, BillTotals } from "@/types";

function makeItem(): BillItem {
  return { id: uuidv4(), hsCode: '', particulars: '', qty: 1, sellPrice: '' };
}

const ZERO_TOTALS: BillTotals = { subTotal: 0, discAmt: 0, discPct: 0, taxable: 0, vat13: 0, grandTotal: 0 };

export default function Home() {
  const [items, setItems] = useState<BillItem[]>([makeItem()]);
  const [grandTotalInput, setGrandTotalInput] = useState('');
  const [discountPct, setDiscountPct] = useState('');
  const [discountAmt, setDiscountAmt] = useState('');
  const [gtMode, setGtMode] = useState(false);
  const [totals, setTotals] = useState<BillTotals>(ZERO_TOTALS);

  const scaleWrapRef = useRef<HTMLDivElement>(null);
  const scalerRef = useRef<HTMLDivElement>(null);

  const recalc = useCallback((currentItems: BillItem[], discAmt: string, discPct: string) => {
    setTotals(calcTotals(currentItems, parseFloat(discAmt) || 0, parseFloat(discPct) || 0));
  }, []);

  const recalcFromGT = useCallback((
    gt: number, currentItems: BillItem[], dAmtStr: string, dPctStr: string
  ): BillItem[] => {
    if (gt <= 0) return currentItems;
    const dVatIncl = parseFloat(dAmtStr) || 0;
    const dPct = parseFloat(dPctStr) || 0;
    const totalSellVatIncl = dVatIncl > 0 ? gt + dVatIncl
      : dPct > 0 ? gt / (1 - dPct / 100)
      : gt;
    const totalQty = currentItems.reduce((s, it) => s + (parseFloat(String(it.qty)) || 1), 0);
    const pricePerUnit = totalQty > 0 ? totalSellVatIncl / totalQty : totalSellVatIncl;
    return currentItems.map(it => ({ ...it, sellPrice: parseFloat(pricePerUnit.toFixed(2)) }));
  }, []);

  const handleGrandTotalChange = (val: string) => {
    setGrandTotalInput(val);
    setGtMode(true);
    const gt = parseFloat(val) || 0;
    if (gt <= 0) { recalc(items, discountAmt, discountPct); return; }
    const sp0 = parseFloat(String(items[0]?.sellPrice)) || 0;
    if (sp0 > 0) {
      const rawQty = (gt + (parseFloat(discountAmt) || 0)) / sp0;
      const updated = items.map((it, i) => i === 0 ? { ...it, qty: parseFloat(rawQty.toFixed(2)) } : it);
      setItems(updated);
      recalc(updated, discountAmt, discountPct);
    } else {
      const updated = recalcFromGT(gt, items, discountAmt, discountPct);
      setItems(updated);
      recalc(updated, discountAmt, discountPct);
    }
  };

  const handleItemChange = (id: string, updated: Partial<BillItem>) => {
    setItems(prev => {
      const next = prev.map(it => it.id === id ? { ...it, ...updated } : it);
      const gt = parseFloat(grandTotalInput) || 0;
      if (gt > 0 && 'sellPrice' in updated) {
        setGtMode(true);
        const sp = parseFloat(String(updated.sellPrice)) || 0;
        if (sp > 0) {
          const rawQty = (gt + (parseFloat(discountAmt) || 0)) / sp;
          const withQty = next.map(it => it.id === id ? { ...it, qty: parseFloat(rawQty.toFixed(2)) } : it);
          recalc(withQty, discountAmt, discountPct);
          return withQty;
        }
      } else if (gt > 0 && 'qty' in updated) {
        setGtMode(true);
        const withSp = recalcFromGT(gt, next, discountAmt, discountPct);
        recalc(withSp, discountAmt, discountPct);
        return withSp;
      } else {
        setGtMode(false);
        const newTotals = calcTotals(next, parseFloat(discountAmt) || 0, parseFloat(discountPct) || 0);
        setGrandTotalInput(newTotals.grandTotal > 0 ? String(parseFloat(newTotals.grandTotal.toFixed(2))) : '');
        recalc(next, discountAmt, discountPct);
      }
      return next;
    });
  };

  const handleDiscPctChange = (val: string) => {
    setDiscountPct(val);
    const discVatIncl = getSubTotal(items) * (parseFloat(val) || 0) / 100 * 1.13;
    const syncedAmt = discVatIncl > 0 ? String(parseFloat(discVatIncl.toFixed(2))) : '';
    setDiscountAmt(syncedAmt);
    if (gtMode) {
      const updated = recalcFromGT(parseFloat(grandTotalInput) || 0, items, syncedAmt, val);
      setItems(updated); recalc(updated, syncedAmt, val);
    } else {
      recalc(items, syncedAmt, val);
    }
  };

  const handleDiscAmtChange = (val: string) => {
    setDiscountAmt(val);
    const subTotal = getSubTotal(items);
    const pct = subTotal > 0 ? ((parseFloat(val) || 0) / 1.13 / subTotal) * 100 : 0;
    const syncedPct = pct > 0 ? String(parseFloat(pct.toFixed(2))) : '';
    setDiscountPct(syncedPct);
    if (gtMode) {
      const updated = recalcFromGT(parseFloat(grandTotalInput) || 0, items, val, syncedPct);
      setItems(updated); recalc(updated, val, syncedPct);
    } else {
      recalc(items, val, syncedPct);
    }
  };

  const addItem = () => setItems(prev => {
    const next = [...prev, makeItem()];
    recalc(next, discountAmt, discountPct);
    return next;
  });

  const removeItem = (id: string) => setItems(prev => {
    const next = prev.filter(it => it.id !== id);
    recalc(next, discountAmt, discountPct);
    return next;
  });

  const resetForm = () => {
    if (!confirm('Reset all fields?')) return;
    const fresh = [makeItem()];
    setItems(fresh);
    setGrandTotalInput('');
    setDiscountPct('');
    setDiscountAmt('');
    setGtMode(false);
    setTotals(ZERO_TOTALS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scaleBill = useCallback(() => {
    const wrap = scaleWrapRef.current;
    const scaler = scalerRef.current;
    if (!wrap || !scaler) return;
    const scale = Math.min(1, wrap.clientWidth / 620);
    scaler.style.width = '620px';
    scaler.style.transform = `scale(${scale})`;
    scaler.style.transformOrigin = 'top left';
    const inner = scaler.firstElementChild as HTMLElement;
    if (inner) wrap.style.height = Math.ceil(inner.offsetHeight * scale) + 'px';
  }, []);

  useEffect(() => {
    scaleBill();
    window.addEventListener('resize', scaleBill);
    return () => window.removeEventListener('resize', scaleBill);
  }, [scaleBill, items, totals]);

  useEffect(() => {
    if (!gtMode)
      setGrandTotalInput(totals.grandTotal > 0 ? String(parseFloat(totals.grandTotal.toFixed(2))) : '');
  }, [totals.grandTotal, gtMode]);

  return (
    <div className="bg-[#f2f4f7] min-h-screen pb-20 sm:pb-0">
      <TopBar />

      <div className="sm:max-w-[660px] sm:mx-auto px-3">
        <QuickEntry value={grandTotalInput} onChange={handleGrandTotalChange} />
        <ItemsSection items={items} onAdd={addItem} onRemove={removeItem} onChange={handleItemChange} />
        <DiscountSection
          discountPct={discountPct}
          discountAmt={discountAmt}
          onPctChange={handleDiscPctChange}
          onAmtChange={handleDiscAmtChange}
        />
        <SummaryCard totals={totals} />

        <p className="no-print mt-3 mb-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          Bill Preview
        </p>
      </div>

      <div ref={scaleWrapRef} className="mx-3 mb-3 rounded-lg overflow-hidden shadow-md sm:max-w-[660px] sm:mx-auto">
        <div ref={scalerRef}>
          <BillPreview items={items} totals={totals} />
        </div>
      </div>

      <ActionBar onReset={resetForm} />
    </div>
  );
}
