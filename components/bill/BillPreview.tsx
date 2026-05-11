"use client";

import { fmt } from "@/lib/calculations";
import { amountInWords } from "@/lib/numToWords";
import type { BillItem, BillTotals } from "@/types";

interface BillPreviewProps {
  items: BillItem[];
  totals: BillTotals;
}

const EMPTY_ROWS = 14;

export default function BillPreview({ items, totals }: BillPreviewProps) {
  const { subTotal, discAmt, discPct, taxable, vat13, grandTotal } = totals;
  const vatDigits = "619731300".split('');
  const discLabel = discPct > 0 ? parseFloat(discPct.toFixed(2)) : '......';
  const emptyRows = Math.max(0, EMPTY_ROWS - items.length);

  return (
    <div
      id="bill"
      style={{
        width: 620,
        background: '#fef08a',
        padding: '18px 22px 14px',
        fontFamily: 'var(--font-poppins), Poppins, sans-serif',
        fontSize: 11,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <h1 style={{ fontSize: 20, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 }}>
          Mayju Boutique Pvt. Ltd.
        </h1>
        <p style={{ fontSize: 11, margin: 0 }}>
          Kalanki-14, Kathmandu &nbsp;|&nbsp; Contact No: 9801012333
        </p>
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '8px 0 5px', fontSize: 11 }}>
        <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          VAT No.&nbsp;
          {vatDigits.map((d, i) => (
            <span key={i} style={vatDigitStyle}>{d}</span>
          ))}
        </div>
        <div style={{ fontWeight: 700, fontSize: 13, textDecoration: 'underline' }}>INVOICE</div>
        <div>Date: <strong>___________</strong></div>
      </div>

      {/* Buyer info */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, margin: '5px 0' }}>
        <tbody>
          <tr>
            <td style={tdNowrap}>Buyer&apos;s Name:</td>
            <td style={{ padding: '2px 4px', borderBottom: '1px dotted #444', width: '99%' }}>&nbsp;</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td style={tdNowrap}>Address:</td>
            <td style={{ padding: '2px 4px', borderBottom: '1px dotted #444' }}>&nbsp;</td>
            <td style={{ ...tdNowrap, textAlign: 'right' }}>Invoice No:</td>
            <td style={{ color: '#c00', fontWeight: 900, fontSize: 15, whiteSpace: 'nowrap', paddingLeft: 4 }}>_____</td>
          </tr>
          <tr>
            <td style={tdNowrap}>Buyer&apos;s VAT No.:</td>
            <td style={{ padding: '2px 4px' }}>
              {"         ".split('').map((_, i) => (
                <span key={i} style={vatDigitStyle}></span>
              ))}
            </td>
            <td style={{ ...tdNowrap, textAlign: 'right' }}>Mode of Payment:</td>
            <td style={{ fontSize: 10, whiteSpace: 'nowrap', paddingLeft: 4 }}>Cash</td>
          </tr>
        </tbody>
      </table>

      {/* Items table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 6, fontSize: 11 }}>
        <thead>
          <tr>
            {[
              { label: 'S.N.', w: 24 },
              { label: 'H.S.Code', w: 80 },
              { label: 'Particulars', w: undefined },
              { label: 'Qty', w: 36 },
              { label: 'Rate', w: 70 },
              { label: 'Amount\nRs.', w: 70 },
              { label: 'Ps.', w: 30 },
            ].map((col, i) => (
              <th key={i} style={{ border: '1px solid #333', padding: '4px 3px', textAlign: 'center', fontSize: 10, background: '#fde047', width: col.w }}>
                {col.label.split('\n').map((line, j, arr) => (
                  <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                ))}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const sp = parseFloat(String(item.sellPrice)) || 0;
            const rate = sp / 1.13;
            const amt = item.qty * rate;
            const rsInt = Math.floor(amt);
            const ps = Math.round((amt - rsInt) * 100);
            return (
              <tr key={item.id}>
                <td style={tdCenter}>{i + 1}</td>
                <td style={tdCenter}>{item.hsCode}</td>
                <td style={{ border: '1px solid #333', padding: '6px 4px', verticalAlign: 'top' }}>{item.particulars}</td>
                <td style={tdCenter}>{item.qty}</td>
                <td style={tdRight}>{rate > 0 ? rate.toFixed(2) : ''}</td>
                <td style={tdRight}>{rsInt > 0 ? rsInt.toLocaleString('en-IN') : ''}</td>
                <td style={{ ...tdCenter, fontSize: 9 }}>{amt > 0 ? (ps > 0 ? ps : '00') : ''}</td>
              </tr>
            );
          })}
          {Array.from({ length: emptyRows }).map((_, i) => (
            <tr key={`empty-${i}`}>
              {[...Array(7)].map((__, j) => (
                <td key={j} style={{ border: '1px solid #333', padding: '6px 4px' }}>{j === 0 ? ' ' : ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer */}
      <div style={{ marginTop: 3 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ flex: 1, fontSize: 10, border: '1px solid #333', padding: '5px 6px', minHeight: 56 }}>
            <strong style={{ display: 'block', marginBottom: 3, fontSize: 10 }}>Amount in Words Rs.:</strong>
            {grandTotal > 0 ? amountInWords(grandTotal) : '—'}
          </div>
          <div style={{ width: 230, fontSize: 11 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr><td style={tLabel}>Sub Total</td><td style={tVal}>{subTotal > 0 ? fmt(subTotal) : '—'}</td></tr>
                <tr><td style={tLabel}>{discLabel}% Discount</td><td style={tVal}>{discAmt > 0 ? fmt(discAmt) : '—'}</td></tr>
                <tr><td style={tLabel}>Taxable Value</td><td style={tVal}>{taxable > 0 ? fmt(taxable) : '—'}</td></tr>
                <tr><td style={tLabel}>13% Vat</td><td style={tVal}>{vat13 > 0 ? fmt(vat13) : '—'}</td></tr>
                <tr>
                  <td style={{ ...tLabel, background: '#fde047', fontSize: 12, fontWeight: 900 }}>Grand Total</td>
                  <td style={{ ...tVal, background: '#fde047', fontSize: 12, fontWeight: 900 }}>{grandTotal > 0 ? fmt(grandTotal) : '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Signature */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 10, alignItems: 'flex-end' }}>
        <div>E.&amp;O.E.</div>
        <div>
          <div style={{ borderTop: '1px solid #333', width: 150, marginTop: 26, textAlign: 'center', fontSize: 9, paddingTop: 2 }}>
            For: MAYJU BOUTIQUE PVT. LTD.
          </div>
        </div>
      </div>
    </div>
  );
}

const vatDigitStyle: React.CSSProperties = {
  border: '1px solid #333', display: 'inline-block',
  width: 16, height: 18, textAlign: 'center',
  lineHeight: '18px', fontWeight: 700, fontSize: 12,
};
const tdNowrap: React.CSSProperties = { whiteSpace: 'nowrap', padding: '2px 4px 2px 0' };
const tdCenter: React.CSSProperties = { border: '1px solid #333', padding: '6px 4px', verticalAlign: 'top', textAlign: 'center' };
const tdRight: React.CSSProperties = { border: '1px solid #333', padding: '6px 4px', verticalAlign: 'top', textAlign: 'right' };
const tLabel: React.CSSProperties = { border: '1px solid #333', padding: '3px 5px', textAlign: 'right', fontSize: 10 };
const tVal: React.CSSProperties = { border: '1px solid #333', padding: '3px 5px', textAlign: 'right', fontWeight: 700, width: 80 };
