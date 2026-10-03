// Rates relative to 1 USD. No one-to-one mappings.
const RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 156.7,
};

const CURRENCIES = Object.keys(RATES);

const styles = `
.cc-wrap {
  --paper: #f2efe6;
  --ink: #1d2b2a;
  --moss: #2f5d50;
  --stamp: #b4372f;
  max-width: 420px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: var(--paper);
  color: var(--ink);
  border: 2px solid var(--ink);
  border-radius: 6px;
  font-family: Georgia, "Times New Roman", serif;
  box-shadow: 6px 6px 0 var(--moss);
}
.cc-wrap h2 { margin: 0 0 1rem; font-size: 1.5rem; letter-spacing: 0.02em; }
.cc-field { display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1rem; }
.cc-field label { font-size: 0.9rem; font-style: italic; }
.cc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.cc-wrap input, .cc-wrap select {
  font: inherit;
  padding: 0.55rem 0.6rem;
  background: #fff;
  color: var(--ink);
  border: 1.5px solid var(--ink);
  border-radius: 4px;
}
.cc-wrap input:focus-visible, .cc-wrap select:focus-visible {
  outline: 3px solid var(--stamp);
  outline-offset: 2px;
}
.cc-result {
  margin: 1.25rem 0 0;
  padding-top: 1rem;
  border-top: 2px dashed var(--ink);
  font-size: 2rem;
  font-weight: bold;
  color: var(--moss);
  word-break: break-word;
}
`;

export function CurrencyConverter() {
  const { useState, useMemo } = React;

  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");

  // Converted amounts for every currency, keyed to the "from" currency.
  // Depends only on amount and fromCurrency, so changing the "to" select
  // does not recompute this.
  const convertedAmounts = useMemo(() => {
    const value = parseFloat(amount);
    const safeValue = Number.isNaN(value) ? 0 : value;
    const inUsd = safeValue / RATES[fromCurrency];
    return CURRENCIES.reduce((acc, code) => {
      acc[code] = inUsd * RATES[code];
      return acc;
    }, {});
  }, [amount, fromCurrency]);

  const converted = convertedAmounts[toCurrency].toFixed(2);

  return (
    <div className="cc-wrap">
      <style>{styles}</style>
      <h2>Currency Converter</h2>

      <div className="cc-field">
        <label htmlFor="cc-amount">Amount</label>
        <input
          id="cc-amount"
          type="number"
          min="0"
          step="any"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="cc-row">
        <div className="cc-field">
          <label htmlFor="cc-from">From</label>
          <select
            id="cc-from"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>

        <div className="cc-field">
          <label htmlFor="cc-to">To</label>
          <select
            id="cc-to"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            {CURRENCIES.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="cc-result" data-testid="converted-amount">
        {`${converted} ${toCurrency}`}
      </p>
    </div>
  );
}