export interface BillItem {
  id: string;
  hsCode: string;
  particulars: string;
  qty: number;
  sellPrice: number | string;
}

export interface BillTotals {
  subTotal: number;
  discAmt: number;
  discPct: number;
  taxable: number;
  vat13: number;
  grandTotal: number;
}
