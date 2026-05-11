const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
  'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

function numToWords(n: number): string {
  n = Math.round(n);
  if (n === 0) return 'Zero';
  if (n < 0) return 'Minus ' + numToWords(-n);
  let w = '';
  if (n >= 10000000) { w += numToWords(Math.floor(n / 10000000)) + ' Crore '; n %= 10000000; }
  if (n >= 100000)   { w += numToWords(Math.floor(n / 100000))   + ' Lakh ';  n %= 100000;  }
  if (n >= 1000)     { w += numToWords(Math.floor(n / 1000))     + ' Thousand '; n %= 1000; }
  if (n >= 100)      { w += numToWords(Math.floor(n / 100))      + ' Hundred ';  n %= 100;  }
  if (n >= 20)       { w += tens[Math.floor(n / 10)] + ' '; n %= 10; }
  if (n > 0)         { w += ones[n] + ' '; }
  return w.trim();
}

export function amountInWords(n: number): string {
  const whole = Math.floor(n);
  const paisa = Math.round((n - whole) * 100);
  let w = numToWords(whole);
  if (paisa > 0) w += ' and ' + numToWords(paisa) + ' Paisa';
  return w + ' Only';
}
