import type { BillItem, BillTotals } from "@/types";

export function fmt(n: number): string {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + '/-';
}

export function getSubTotal(items: BillItem[]): number {
  return items.reduce((sum, item) => {
    const sp = parseFloat(String(item.sellPrice)) || 0;
    return sum + item.qty * (sp / 1.13);
  }, 0);
}

export function calcTotals(
  items: BillItem[],
  discountAmtVatIncl: number,
  discountPct: number
): BillTotals {
  const subTotal = getSubTotal(items);
  const discAmt = parseFloat((discountAmtVatIncl / 1.13).toFixed(2));
  const resolvedDiscPct = subTotal > 0 ? (discAmt / subTotal) * 100 : discountPct;
  const taxable = parseFloat((subTotal - discAmt).toFixed(2));
  const vat13 = parseFloat((taxable * 0.13).toFixed(2));
  const grandTotal = parseFloat((taxable + vat13).toFixed(2));
  return { subTotal, discAmt, discPct: resolvedDiscPct, taxable, vat13, grandTotal };
}
