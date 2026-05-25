'use client';

import { useState, useMemo } from 'react';

type Mode = 'beginner' | 'expert';

type FinancingType = 'conventional-fixed' | 'conventional-arm' | 'fha' | 'va' | 'cash' | '';
type InspectionType = 'full' | 'limited' | 'waived' | '';
type PossessionType = 'at-closing' | 'post-closing' | '';
type TitleElection = 'a' | 'b' | 'c' | 'd' | '';
type ProrationMethod = 'long' | 'short' | '';

interface FormState {
  // Property
  address: string;
  yearBuilt: string;
  // Price & Earnest Money
  purchasePrice: string;
  earnestMoney: string;
  earnestDays: string;
  earnestHolder: string;
  sellerConcessions: string;
  // Financing
  financingType: FinancingType;
  downPaymentPct: string;
  prequal: 'attached' | 'within-days' | '';
  prequal_days: string;
  milestone_b_days: string;
  milestone_c_days: string;
  milestone_d_days: string;
  closingDate: string;
  // Inspection
  inspectionType: InspectionType;
  inspectionDays: string;
  considerationDays: string;
  settlementDays: string;
  // Tax
  annualTaxes: string;
  prorationMethod: ProrationMethod;
  // Possession
  possessionType: PossessionType;
  possessionDays: string;
  // HOA
  hasHOA: '' | 'yes' | 'no';
  hoaCapitalContribution: '' | 'required' | 'not-required' | 'unknown';
  hoaCapitalAmount: string;
  hoaDocDeliveryDays: string;
  hoaDisapprovalDays: string;
  // Title
  titleElection: TitleElection;
  // Deed
  deedVesting: string;
}

const EMPTY: FormState = {
  address: '', yearBuilt: '',
  purchasePrice: '', earnestMoney: '', earnestDays: '3', earnestHolder: '',
  sellerConcessions: '',
  financingType: '', downPaymentPct: '', prequal: '', prequal_days: '5',
  milestone_b_days: '30', milestone_c_days: '21', milestone_d_days: '7',
  closingDate: '',
  inspectionType: '', inspectionDays: '10', considerationDays: '5', settlementDays: '3',
  annualTaxes: '', prorationMethod: '',
  possessionType: '', possessionDays: '',
  hasHOA: '', hoaCapitalContribution: '', hoaCapitalAmount: '',
  hoaDocDeliveryDays: '10', hoaDisapprovalDays: '5',
  titleElection: '',
  deedVesting: '',
};

const SECTIONS = [
  { key: 'price', label: 'Price & Earnest' },
  { key: 'financing', label: 'Financing' },
  { key: 'appraisal', label: 'Appraisal' },
  { key: 'inspection', label: 'Inspection' },
  { key: 'taxes', label: 'Tax Proration' },
  { key: 'possession', label: 'Possession' },
  { key: 'hoa', label: 'HOA' },
  { key: 'title', label: 'Title' },
];

function Flag({ text }: { text: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 8,
      background: 'oklch(0.72 0.14 78 / 0.15)',
      border: '1px solid oklch(0.72 0.14 78 / 0.4)',
      borderRadius: 8, padding: '10px 12px', marginTop: 10,
      fontSize: 12, color: 'oklch(0.86 0.15 88)', lineHeight: 1.5,
    }}>
      <span style={{ flexShrink: 0, marginTop: 1 }}>⚠</span>
      <span>{text}</span>
    </div>
  );
}

function Coach({ text, mode }: { text: string; mode: Mode }) {
  if (mode === 'expert') return null;
  return (
    <div style={{
      fontSize: 12, color: 'var(--ink-mute)', lineHeight: 1.6,
      background: 'var(--bg-2)', borderRadius: 8, padding: '10px 12px',
      marginTop: 8, borderLeft: '2px solid var(--accent-soft)',
    }}>
      {text}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-mute)', marginBottom: 6 }}>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, mono = false, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', background: 'var(--bg-2)', border: '1px solid var(--line-soft)',
        borderRadius: 8, color: 'var(--ink)', fontSize: 13, padding: '10px 12px',
        fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit', outline: 'none',
        transition: 'border-color 0.15s',
      }}
      onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
      onBlur={e => (e.target.style.borderColor = 'var(--line-soft)')}
    />
  );
}

function Select({ value, onChange, options }: {
  value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%', background: 'var(--bg-2)', border: '1px solid var(--line-soft)',
        borderRadius: 8, color: value ? 'var(--ink)' : 'var(--ink-mute)',
        fontSize: 13, padding: '10px 12px', outline: 'none', cursor: 'pointer',
        transition: 'border-color 0.15s', appearance: 'none',
      }}
      onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
      onBlur={e => (e.target.style.borderColor = 'var(--line-soft)')}
    >
      {options.map(o => (
        <option key={o.value} value={o.value} style={{ background: 'oklch(0.22 0.022 300)' }}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Row({ children, cols = 2 }: { children: React.ReactNode; cols?: number }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16, marginBottom: 20 }}>
      {children}
    </div>
  );
}

function Field({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
      color: 'var(--accent-strong)', marginBottom: 20, paddingBottom: 10,
      borderBottom: '1px solid var(--line-soft)',
    }}>
      {children}
    </div>
  );
}

function parseMoney(s: string): number {
  return parseFloat(s.replace(/[^0-9.]/g, '')) || 0;
}

function fmtMoney(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export function ScrivenerView() {
  const [mode, setMode] = useState<Mode>('beginner');
  const [section, setSection] = useState('price');
  const [form, setForm] = useState<FormState>(EMPTY);

  const set = (k: keyof FormState) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const price = parseMoney(form.purchasePrice);
  const em = parseMoney(form.earnestMoney);
  const emPct = price > 0 ? (em / price) * 100 : 0;
  const concessions = parseMoney(form.sellerConcessions);
  const annualTax = parseMoney(form.annualTaxes);

  const taxProration = useMemo(() => {
    if (!form.closingDate || annualTax === 0) return null;
    const closing = new Date(form.closingDate);
    const year = closing.getFullYear();
    const jan1 = new Date(year, 0, 1);
    const jul1 = new Date(year, 6, 1);
    const dailyRate = annualTax / 365;
    const longDays = Math.round((closing.getTime() - jan1.getTime()) / 86400000);
    const longCredit = longDays * dailyRate;
    const isSecondHalf = closing >= jul1;
    const shortDays = isSecondHalf ? Math.round((closing.getTime() - jul1.getTime()) / 86400000) : longDays;
    const shortCredit = shortDays * dailyRate;
    return { longCredit, shortCredit, longDays, shortDays, isSecondHalf, dailyRate };
  }, [form.closingDate, annualTax]);

  const concessionMaxPct = useMemo(() => {
    if (form.financingType === 'cash') return null;
    const down = parseFloat(form.downPaymentPct) || 0;
    const ltv = 100 - down;
    if (form.financingType === 'fha') return 6;
    if (form.financingType === 'va') return 4;
    if (form.financingType.startsWith('conventional')) {
      if (ltv > 90) return 3;
      if (ltv >= 75) return 6;
      return 9;
    }
    return null;
  }, [form.financingType, form.downPaymentPct]);

  const completedSections = useMemo(() => {
    const done: string[] = [];
    if (form.purchasePrice && form.earnestMoney) done.push('price');
    if (form.financingType) done.push('financing');
    if (form.closingDate) done.push('appraisal');
    if (form.inspectionType) done.push('inspection');
    if (form.annualTaxes && form.prorationMethod) done.push('taxes');
    if (form.possessionType) done.push('possession');
    if (form.hasHOA) done.push('hoa');
    if (form.titleElection) done.push('title');
    return done;
  }, [form]);

  return (
    <main className="main" style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ padding: '20px 28px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--ink-mute)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
            Workspace <span style={{ margin: '0 6px' }}>·</span> <span style={{ color: 'var(--accent-strong)' }}>RE Scrivener</span>
          </div>
          <h1 style={{ margin: 0, fontFamily: 'Instrument Serif, serif', fontWeight: 400, fontSize: 30, letterSpacing: '-0.01em' }}>
            Ohio Purchase Agreement
          </h1>
          {form.address && (
            <div style={{ fontSize: 13, color: 'var(--ink-dim)', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>
              {form.address}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 12, color: 'var(--ink-mute)' }}>Mode:</div>
          <div style={{ display: 'flex', background: 'var(--bg-2)', borderRadius: 8, padding: 3, border: '1px solid var(--line-soft)' }}>
            {(['beginner', 'expert'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: '5px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                  background: mode === m ? 'var(--accent-soft)' : 'none',
                  color: mode === m ? 'var(--accent-strong)' : 'var(--ink-mute)',
                  border: mode === m ? '1px solid oklch(0.72 0.14 298 / 0.3)' : '1px solid transparent',
                  transition: 'all 0.15s', textTransform: 'capitalize',
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Property address bar */}
      <div style={{ padding: '16px 28px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg-1)', border: '1px solid var(--line-soft)', borderRadius: 10, padding: '10px 16px' }}>
          <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-mute)', flexShrink: 0 }}>Property</span>
          <input
            value={form.address}
            onChange={e => set('address')(e.target.value)}
            placeholder="Enter property address…"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--ink)', fontSize: 13, fontFamily: 'JetBrains Mono, monospace' }}
          />
          <input
            value={form.yearBuilt}
            onChange={e => set('yearBuilt')(e.target.value)}
            placeholder="Year built"
            style={{ width: 90, background: 'none', border: 'none', outline: 'none', color: 'var(--ink-dim)', fontSize: 12, fontFamily: 'JetBrains Mono, monospace', textAlign: 'right' }}
          />
        </div>
      </div>

      {/* Progress + Section tabs */}
      <div style={{ padding: '16px 28px 0' }}>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {SECTIONS.map(s => {
            const done = completedSections.includes(s.key);
            const active = section === s.key;
            return (
              <button
                key={s.key}
                onClick={() => setSection(s.key)}
                style={{
                  padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                  whiteSpace: 'nowrap', transition: 'all 0.15s', flexShrink: 0,
                  background: active ? 'var(--accent-soft)' : done ? 'oklch(0.60 0.14 148 / 0.15)' : 'var(--bg-2)',
                  color: active ? 'var(--accent-strong)' : done ? 'oklch(0.78 0.16 148)' : 'var(--ink-mute)',
                  border: active ? '1px solid oklch(0.72 0.14 298 / 0.3)' : done ? '1px solid oklch(0.60 0.14 148 / 0.3)' : '1px solid transparent',
                }}
              >
                {done && !active ? '✓ ' : ''}{s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section content */}
      <div style={{ padding: '24px 28px 60px', maxWidth: 760 }}>

        {/* ── PRICE & EARNEST MONEY ── */}
        {section === 'price' && (
          <div>
            <SectionTitle>Price & Earnest Money</SectionTitle>

            <Row>
              <Field>
                <Label>Purchase Price</Label>
                <Input value={form.purchasePrice} onChange={set('purchasePrice')} placeholder="$0" mono />
              </Field>
              <Field>
                <Label>Earnest Money</Label>
                <Input value={form.earnestMoney} onChange={set('earnestMoney')} placeholder="$0" mono />
                {price > 0 && em > 0 && (
                  <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 6, fontFamily: 'JetBrains Mono, monospace' }}>
                    {emPct.toFixed(2)}% of purchase price
                  </div>
                )}
                {emPct > 0 && emPct < 0.5 && <Flag text="Unusually low earnest money (under 0.5%). This may signal buyer uncertainty. Consider discussing with your client." />}
                {emPct > 5 && <Flag text="Higher than typical (over 5%). Confirm this is intentional — some lenders limit earnest money application to purchase price." />}
              </Field>
            </Row>

            <Coach mode={mode} text={`The purchase price is your starting point — not necessarily your ending point. Once it's in the contract, everything anchors to it: your loan amount, earnest money, and the seller's net. Before settling on a number, review the comps together.\n\nEarnest money is your deposit — it shows the seller you're serious. It applies toward your purchase price at closing. You're protected if financing falls through or inspection reveals something major. The risk is backing out without a contingency reason.`} />

            {price > 0 && (
              <div style={{ background: 'var(--bg-2)', borderRadius: 10, padding: '14px 16px', marginBottom: 20, fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--ink-dim)' }}>
                <div style={{ color: 'var(--ink-mute)', marginBottom: 8, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'Inter, sans-serif' }}>EM Range Guide</div>
                <div>1% → {fmtMoney(price * 0.01)}</div>
                <div>2% → {fmtMoney(price * 0.02)}</div>
                <div>3% → {fmtMoney(price * 0.03)}</div>
              </div>
            )}

            <Row>
              <Field>
                <Label>EM Delivery (calendar days)</Label>
                <Input value={form.earnestDays} onChange={set('earnestDays')} placeholder="3" mono />
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 4 }}>Ohio standard: 3 days. Day 1 = day AFTER acceptance.</div>
              </Field>
              <Field>
                <Label>EM Holder</Label>
                <Input value={form.earnestHolder} onChange={set('earnestHolder')} placeholder="Title company name" />
              </Field>
            </Row>

            <div style={{ marginBottom: 20 }}>
              <Label>Seller Concessions</Label>
              <Input value={form.sellerConcessions} onChange={set('sellerConcessions')} placeholder="$0 (leave blank if none)" mono />
              {concessionMaxPct !== null && price > 0 && concessions > 0 && (
                <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 6, fontFamily: 'JetBrains Mono, monospace' }}>
                  Max allowed: {fmtMoney(price * concessionMaxPct / 100)} ({concessionMaxPct}% — {form.financingType || 'select loan type'})
                </div>
              )}
              {concessionMaxPct !== null && price > 0 && concessions > price * concessionMaxPct / 100 && (
                <Flag text={`Concessions exceed lender limit of ${concessionMaxPct}% (${fmtMoney(price * concessionMaxPct / 100)}) for this loan type. Reduce or confirm with lender.`} />
              )}
            </div>

            <Coach mode={mode} text="Seller concessions are credited to your closing costs at settlement — not cash in hand. It reduces your cash needed to close. For your loan type, there's a hard cap. Offering concessions can make the deal work for a buyer who's tight on cash without reducing the sale price." />
          </div>
        )}

        {/* ── FINANCING ── */}
        {section === 'financing' && (
          <div>
            <SectionTitle>Financing</SectionTitle>
            <Coach mode={mode} text="The financing type you select here locks you into a specific contingency path. Make sure it matches exactly what your lender pre-qualified you for." />

            <div style={{ marginBottom: 20 }}>
              <Label>Loan Type</Label>
              <Select
                value={form.financingType}
                onChange={set('financingType')}
                options={[
                  { value: '', label: '— Select financing type —' },
                  { value: 'conventional-fixed', label: 'Conventional Fixed' },
                  { value: 'conventional-arm', label: 'Conventional ARM' },
                  { value: 'fha', label: 'FHA' },
                  { value: 'va', label: 'VA' },
                  { value: 'cash', label: 'Cash' },
                ]}
              />
            </div>

            {form.financingType === 'conventional-fixed' && (
              <Coach mode={mode} text="A conventional loan is a standard mortgage not backed by the government. At 20% down, you skip private mortgage insurance — that saves real money every month. Your pre-qual already accounts for this." />
            )}
            {form.financingType === 'fha' && (
              <Coach mode={mode} text="FHA loans are government-backed — lower down payment (3.5% if credit score 580+). The tradeoff: mortgage insurance for the life of the loan, and the FHA appraisal process is stricter. The appraiser can flag property conditions the seller must fix before the loan closes." />
            )}
            {form.financingType === 'va' && (
              <Coach mode={mode} text="Your VA entitlement is a powerful benefit — no down payment, no private mortgage insurance, competitive rates. The VA funding fee is typically financed into the loan. VA appraisals are strict about property condition — you still want a full inspection." />
            )}
            {form.financingType === 'cash' && (
              <Coach mode={mode} text="Cash offers are the cleanest from a seller's perspective — no financing contingency, no lender appraisal. You still want an inspection. You control the timeline in a way financed buyers can't." />
            )}

            {form.financingType && form.financingType !== 'cash' && (
              <>
                <Row>
                  <Field>
                    <Label>Down Payment %</Label>
                    <Input value={form.downPaymentPct} onChange={set('downPaymentPct')} placeholder="20" mono />
                    {price > 0 && form.downPaymentPct && (
                      <div style={{ fontSize: 12, color: 'var(--ink-mute)', marginTop: 4, fontFamily: 'JetBrains Mono, monospace' }}>
                        = {fmtMoney(price * parseFloat(form.downPaymentPct) / 100)} down · {fmtMoney(price * (1 - parseFloat(form.downPaymentPct) / 100))} financed
                      </div>
                    )}
                  </Field>
                  <Field>
                    <Label>Closing Date (target)</Label>
                    <Input value={form.closingDate} onChange={set('closingDate')} type="date" />
                  </Field>
                </Row>

                <div style={{ marginBottom: 24, background: 'var(--bg-1)', borderRadius: 10, padding: '16px', border: '1px solid var(--line-soft)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-mute)', marginBottom: 14 }}>
                    Financing Milestones (§4a–d)
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 16, lineHeight: 1.5 }}>
                    Missing any milestone silently activates the seller's right to terminate.
                  </div>

                  <div style={{ display: 'grid', gap: 16 }}>
                    {[
                      { label: '§4(a) Pre-Qual Letter', key: 'prequal' as const, note: 'Attach or provide within N days' },
                      { label: '§4(b) Loan App + Intent to Proceed', key: 'milestone_b_days' as const, note: 'Days from acceptance. Standard: 30 days.' },
                      { label: '§4(c) Conditional Approval', key: 'milestone_c_days' as const, note: 'Underwriter approved pending appraisal/title. Standard: 21 days.' },
                      { label: '§4(d) Clear to Close', key: 'milestone_d_days' as const, note: 'Days prior to closing date. Standard: 7 days.' },
                    ].map(m => (
                      <div key={m.key} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-dim)', marginBottom: 2 }}>{m.label}</div>
                          <div style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{m.note}</div>
                        </div>
                        {m.key === 'prequal' ? (
                          <Select
                            value={form.prequal}
                            onChange={set('prequal')}
                            options={[
                              { value: '', label: '— Select —' },
                              { value: 'attached', label: 'Attached' },
                              { value: 'within-days', label: `Within ${form.prequal_days} days` },
                            ]}
                          />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input
                              type="number"
                              value={form[m.key]}
                              onChange={e => set(m.key)(e.target.value)}
                              style={{
                                width: 60, background: 'var(--bg-2)', border: '1px solid var(--line-soft)',
                                borderRadius: 6, color: 'var(--ink)', fontSize: 13, padding: '6px 10px',
                                fontFamily: 'JetBrains Mono, monospace', outline: 'none', textAlign: 'center',
                              }}
                            />
                            <span style={{ fontSize: 12, color: 'var(--ink-mute)' }}>days</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Coach mode={mode} text="§4(b): This isn't just applying for a loan — it's officially starting the clock. The buyer must pay the appraisal fee ($500–$800) and send WRITTEN confirmation to the seller naming the lender. Application alone doesn't satisfy this milestone. §4(c): Conditional approval means the underwriter has reviewed the full file. The remaining variables are the property itself. §4(d): Clear to close = the money is ready." />
              </>
            )}
          </div>
        )}

        {/* ── APPRAISAL ── */}
        {section === 'appraisal' && (
          <div>
            <SectionTitle>Appraisal Contingency</SectionTitle>

            {form.financingType && form.financingType !== 'cash' && (
              <div style={{ background: 'var(--bg-2)', borderRadius: 10, padding: '14px 16px', marginBottom: 20, fontSize: 13, lineHeight: 1.6, color: 'var(--ink-dim)', border: '1px solid var(--line-soft)' }}>
                <strong style={{ color: 'var(--ink)' }}>Financed deal:</strong> Your appraisal contingency period = §4(d) deadline. No separate timeline needed. Buyer must terminate BEFORE the clear-to-close deadline if the appraisal comes in low.
              </div>
            )}

            {form.financingType === 'cash' && (
              <div style={{ marginBottom: 20 }}>
                <Label>Appraisal Contingency Days (cash deal)</Label>
                <Input value={form.closingDate} onChange={set('closingDate')} placeholder="14–21 days typical" mono />
                <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 4 }}>Enough time to order and receive a private appraisal.</div>
              </div>
            )}

            {price > 0 && (
              <div style={{ background: 'var(--bg-1)', borderRadius: 10, padding: '16px', border: '1px solid var(--line-soft)', marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-mute)', marginBottom: 14 }}>
                  Low Appraisal Scenarios
                </div>
                {[95, 97, 98].map(pct => {
                  const appraised = price * pct / 100;
                  const gap = price - appraised;
                  return (
                    <div key={pct} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line-soft)', fontSize: 12 }}>
                      <span style={{ color: 'var(--ink-mute)' }}>Appraises at {pct}% ({fmtMoney(appraised)})</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', color: 'oklch(0.78 0.16 22)' }}>Gap: {fmtMoney(gap)}</span>
                    </div>
                  );
                })}
                <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginTop: 10, lineHeight: 1.5 }}>
                  Options: buyer pays gap · seller reduces price · split the difference · buyer terminates
                </div>
              </div>
            )}

            <Coach mode={mode} text="An appraisal is an independent assessment of what the house is worth. Your lender won't lend more than the appraised value. If the house appraises low, the buyer chooses: pay more than appraised value out of pocket, renegotiate the price, or walk away. That right expires at the CTC deadline." />
          </div>
        )}

        {/* ── INSPECTION ── */}
        {section === 'inspection' && (
          <div>
            <SectionTitle>Inspection</SectionTitle>

            <div style={{ marginBottom: 20 }}>
              <Label>Inspection Election</Label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { value: 'full', label: 'Full Inspection', desc: 'Recommended for most buyers' },
                  { value: 'limited', label: 'Limited', desc: 'As-is, flips, specific categories only' },
                  { value: 'waived', label: 'Waived', desc: 'No inspection rights — use with caution' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => set('inspectionType')(opt.value)}
                    style={{
                      padding: '12px', borderRadius: 10, textAlign: 'left', transition: 'all 0.15s',
                      background: form.inspectionType === opt.value ? 'var(--accent-soft)' : 'var(--bg-2)',
                      border: form.inspectionType === opt.value ? '1px solid oklch(0.72 0.14 298 / 0.4)' : '1px solid var(--line-soft)',
                      color: form.inspectionType === opt.value ? 'var(--ink)' : 'var(--ink-dim)',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-mute)', lineHeight: 1.4 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {form.inspectionType === 'waived' && form.yearBuilt && parseInt(form.yearBuilt) < 1978 && (
              <Flag text="Lead paint disclosure and pamphlet are still required even if inspection is waived. These are federal requirements, not contingency elections." />
            )}
            {form.inspectionType === 'waived' && (
              <Flag text="Waiving inspection means accepting the property as-is with no right to object to anything discovered. Document this conversation with your client." />
            )}

            {form.inspectionType === 'full' && (
              <Row cols={3}>
                <Field>
                  <Label>Inspection Period (days)</Label>
                  <Input value={form.inspectionDays} onChange={set('inspectionDays')} placeholder="10" mono />
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 4 }}>SFR: 10 · Older/rural: 12–14</div>
                </Field>
                <Field>
                  <Label>Consideration (days)</Label>
                  <Input value={form.considerationDays} onChange={set('considerationDays')} placeholder="5" mono />
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 4 }}>Typical: 5–7 days</div>
                </Field>
                <Field>
                  <Label>Settlement (days)</Label>
                  <Input value={form.settlementDays} onChange={set('settlementDays')} placeholder="3" mono />
                  <div style={{ fontSize: 11, color: 'var(--ink-mute)', marginTop: 4 }}>Typical: 3–5 days</div>
                </Field>
              </Row>
            )}

            <div style={{ background: 'oklch(0.72 0.14 78 / 0.08)', border: '1px solid oklch(0.72 0.14 78 / 0.2)', borderRadius: 10, padding: '16px', marginTop: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'oklch(0.86 0.15 88)', marginBottom: 12 }}>
                ⚠ Auto-Consequence Rules (Ohio)
              </div>
              <div style={{ display: 'grid', gap: 10 }}>
                {[
                  { title: 'Inspection Period Auto-Waiver', text: 'If Buyer does not deliver a Defect Notice OR Notice of Satisfaction before the Inspection Period ends → Buyer is deemed satisfied. The contingency vanishes automatically.' },
                  { title: 'Seller Silence = Deemed Agreement', text: 'If Seller doesn\'t respond to a Defect Notice before the Consideration Period ends → Seller is deemed to have agreed to ALL requested repairs. Silence is not neutral.' },
                  { title: 'Settlement Period Auto-Termination', text: 'If no signed repair agreement before Settlement Period ends → contract terminates automatically, without notice.' },
                ].map(r => (
                  <div key={r.title} style={{ borderLeft: '2px solid oklch(0.72 0.14 78 / 0.5)', paddingLeft: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'oklch(0.86 0.15 88)', marginBottom: 3 }}>{r.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--ink-mute)', lineHeight: 1.5 }}>{r.text}</div>
                  </div>
                ))}
              </div>
            </div>

            <Coach mode={mode} text="Full inspection means you can look at everything — roof, foundation, HVAC, plumbing, electrical, mold, radon. You're not required to ask for repairs on everything. You're looking for what matters to you. Line up an inspector immediately after going under contract." />
          </div>
        )}

        {/* ── TAX PRORATION ── */}
        {section === 'taxes' && (
          <div>
            <SectionTitle>Tax Proration</SectionTitle>

            <Coach mode={mode} text="Ohio taxes are billed in arrears — you're always paying for a year you've already lived through. The buyer is taking over a partially-accrued tax liability. Proration determines how much of that the seller covers at closing." />

            <Row>
              <Field>
                <Label>Most Recent Annual Taxes</Label>
                <Input value={form.annualTaxes} onChange={set('annualTaxes')} placeholder="$0" mono />
              </Field>
              <Field>
                <Label>Closing Date</Label>
                <Input value={form.closingDate} onChange={set('closingDate')} type="date" />
              </Field>
            </Row>

            {taxProration && (
              <div style={{ background: 'var(--bg-1)', borderRadius: 10, padding: '16px', marginBottom: 20, border: '1px solid var(--line-soft)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-mute)', marginBottom: 14 }}>
                  Proration Calculator
                </div>
                <div style={{ display: 'grid', gap: 10, fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--ink-dim)' }}>
                    <span>Daily rate</span>
                    <span>${taxProration.dailyRate.toFixed(2)}/day</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-2)', borderRadius: 8, color: 'var(--ink)' }}>
                    <span>Long proration ({taxProration.longDays} days, Jan 1 → closing)</span>
                    <span style={{ color: 'oklch(0.78 0.16 148)' }}>{fmtMoney(taxProration.longCredit)} credit to buyer</span>
                  </div>
                  {taxProration.isSecondHalf && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'var(--bg-2)', borderRadius: 8, color: 'var(--ink)' }}>
                      <span>Short proration ({taxProration.shortDays} days, Jul 1 → closing)</span>
                      <span style={{ color: 'oklch(0.86 0.15 88)' }}>{fmtMoney(taxProration.shortCredit)} credit to buyer</span>
                    </div>
                  )}
                  {taxProration.isSecondHalf && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'oklch(0.78 0.16 22)', paddingTop: 4 }}>
                      <span>Difference</span>
                      <span>{fmtMoney(taxProration.longCredit - taxProration.shortCredit)} more with long proration</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <Label>Proration Method</Label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { value: 'long', label: 'Long Proration', desc: 'Jan 1 → closing. Ohio default. Buyer-favorable.' },
                  { value: 'short', label: 'Short Proration', desc: 'Start of current billing period → closing. Must be checked to apply. Seller-favorable in fall.' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => set('prorationMethod')(opt.value)}
                    style={{
                      padding: '12px', borderRadius: 10, textAlign: 'left', transition: 'all 0.15s',
                      background: form.prorationMethod === opt.value ? 'var(--accent-soft)' : 'var(--bg-2)',
                      border: form.prorationMethod === opt.value ? '1px solid oklch(0.72 0.14 298 / 0.4)' : '1px solid var(--line-soft)',
                      color: form.prorationMethod === opt.value ? 'var(--ink)' : 'var(--ink-dim)',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-mute)', lineHeight: 1.4 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {taxProration?.isSecondHalf && form.prorationMethod !== 'short' && (
              <Flag text="Closing in the second half of the year. Long proration is the default — this credits the buyer significantly more. If representing the seller, confirm this is intentional vs. short proration." />
            )}

            <Coach mode={mode} text="With long proration (the default), the seller covers everything from January 1 through closing. With short, they only go back to July 1. If you close in October on a $6,000 annual tax bill, that's roughly a $3,000 difference. Buyers want long. Sellers prefer short in the fall." />
          </div>
        )}

        {/* ── POSSESSION ── */}
        {section === 'possession' && (
          <div>
            <SectionTitle>Possession</SectionTitle>

            <div style={{ marginBottom: 20 }}>
              <Label>Possession</Label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { value: 'at-closing', label: 'At Closing', desc: 'Keys handed over when documents record. Most common.' },
                  { value: 'post-closing', label: 'Post-Closing (Rent-Back)', desc: 'Seller stays after closing. Requires post-closing occupancy addendum.' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => set('possessionType')(opt.value)}
                    style={{
                      padding: '14px', borderRadius: 10, textAlign: 'left', transition: 'all 0.15s',
                      background: form.possessionType === opt.value ? 'var(--accent-soft)' : 'var(--bg-2)',
                      border: form.possessionType === opt.value ? '1px solid oklch(0.72 0.14 298 / 0.4)' : '1px solid var(--line-soft)',
                      color: form.possessionType === opt.value ? 'var(--ink)' : 'var(--ink-dim)',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{opt.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--ink-mute)', lineHeight: 1.4 }}>{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {form.possessionType === 'post-closing' && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Label>Days Post-Closing</Label>
                  <Input value={form.possessionDays} onChange={set('possessionDays')} placeholder="Number of days" mono />
                </div>
                <Flag text="Post-closing possession requires a signed Post-Closing Occupancy Agreement — not covered by §24 alone. Define: departure date, daily rate, utility responsibility, and consequences for overstay. Don't close without this document signed." />
              </>
            )}

            <Coach mode={mode} text="If the seller needs time after closing, that's manageable — but get it in writing with a post-closing occupancy agreement. It defines exactly when they leave, who pays utilities, and what happens if they don't vacate. Without it, you have a mortgage on a house you can't move into." />
          </div>
        )}

        {/* ── HOA ── */}
        {section === 'hoa' && (
          <div>
            <SectionTitle>HOA / Association</SectionTitle>

            <div style={{ marginBottom: 20 }}>
              <Label>Is there an HOA?</Label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: '', label: 'Unknown' }].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => set('hasHOA')(opt.value)}
                    style={{
                      padding: '12px', borderRadius: 10, textAlign: 'center', transition: 'all 0.15s',
                      background: form.hasHOA === opt.value ? 'var(--accent-soft)' : 'var(--bg-2)',
                      border: form.hasHOA === opt.value ? '1px solid oklch(0.72 0.14 298 / 0.4)' : '1px solid var(--line-soft)',
                      color: form.hasHOA === opt.value ? 'var(--ink)' : 'var(--ink-dim)',
                      fontSize: 13, fontWeight: 600,
                    }}
                  >
                    {opt.label || 'Unknown'}
                  </button>
                ))}
              </div>
            </div>

            {form.hasHOA === 'yes' && (
              <>
                <div style={{ marginBottom: 20 }}>
                  <Label>Capital Contribution</Label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 12 }}>
                    {[
                      { value: 'required', label: 'Required', desc: 'Enter amount below' },
                      { value: 'not-required', label: 'Not Required', desc: 'None charged' },
                      { value: 'unknown', label: 'Unknown', desc: 'Triggers disapproval period verification' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => set('hoaCapitalContribution')(opt.value)}
                        style={{
                          padding: '10px', borderRadius: 10, textAlign: 'left', transition: 'all 0.15s',
                          background: form.hoaCapitalContribution === opt.value ? 'var(--accent-soft)' : 'var(--bg-2)',
                          border: form.hoaCapitalContribution === opt.value ? '1px solid oklch(0.72 0.14 298 / 0.4)' : '1px solid var(--line-soft)',
                          color: form.hoaCapitalContribution === opt.value ? 'var(--ink)' : 'var(--ink-dim)',
                        }}
                      >
                        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 2 }}>{opt.label}</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-mute)' }}>{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                  {form.hoaCapitalContribution === 'unknown' && (
                    <Flag text="'Unknown' shifts verification to Buyer during the Disapproval Period. Capital contributions can range from a few hundred to thousands of dollars. Verify the exact amount before closing — it affects cash to close." />
                  )}
                  {form.hoaCapitalContribution === 'required' && (
                    <Input value={form.hoaCapitalAmount} onChange={set('hoaCapitalAmount')} placeholder="$0" mono />
                  )}
                </div>

                <Row>
                  <Field>
                    <Label>Doc Delivery Period (days from CAD)</Label>
                    <Input value={form.hoaDocDeliveryDays} onChange={set('hoaDocDeliveryDays')} placeholder="10" mono />
                  </Field>
                  <Field>
                    <Label>Disapproval Period (days)</Label>
                    <Input value={form.hoaDisapprovalDays} onChange={set('hoaDisapprovalDays')} placeholder="5" mono />
                  </Field>
                </Row>

                <Flag text="Seller must provide HOA contact information to the title company at least 20 calendar days before closing. Late delivery = expedited fees at seller's expense. Put this on the action list the day you go under contract." />
              </>
            )}

            <Coach mode={mode} text="Some associations charge a one-time capital contribution when a new owner takes over — it can range from a few hundred dollars to thousands. Confirm the exact amount before closing. It's due from the buyer at closing and affects cash to close." />
          </div>
        )}

        {/* ── TITLE ── */}
        {section === 'title' && (
          <div>
            <SectionTitle>Title Insurance (§20)</SectionTitle>

            <Coach mode={mode} text="Title insurance protects against problems with the chain of title — liens, recording errors, ownership claims. Your lender's policy only protects the bank. An Owner's Policy protects you. One-time fee at closing, covers you as long as you own the home." />

            <div style={{ marginBottom: 20 }}>
              <Label>Title Election</Label>
              <div style={{ display: 'grid', gap: 10 }}>
                {[
                  { value: 'a', label: '(a) Buyer pays full Owner\'s Policy', desc: 'Buyer wants protection and pays for it themselves. Standard.' },
                  { value: 'b', label: '(b) Buyer decides later', desc: 'Risky — rates and simultaneous issue discounts are only available at closing.' },
                  { value: 'c', label: '(c) Seller contributes $500; Buyer pays balance', desc: 'Partial concession. Common as negotiated compromise.' },
                  { value: 'd', label: '(d) Seller pays full Owner\'s Policy; Buyer pays simultaneous issue fee (if financed)', desc: 'Most generous seller election. Common in Ohio markets where sellers have historically paid title.' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => set('titleElection')(opt.value)}
                    style={{
                      padding: '12px 14px', borderRadius: 10, textAlign: 'left', transition: 'all 0.15s',
                      background: form.titleElection === opt.value ? 'var(--accent-soft)' : 'var(--bg-2)',
                      border: form.titleElection === opt.value ? '1px solid oklch(0.72 0.14 298 / 0.4)' : '1px solid var(--line-soft)',
                      color: form.titleElection === opt.value ? 'var(--ink)' : 'var(--ink-dim)',
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--accent-strong)', flexShrink: 0, marginTop: 1 }}>{opt.value.toUpperCase()}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{opt.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--ink-mute)', lineHeight: 1.5 }}>{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {form.titleElection === 'b' && (
              <Flag text="Electing to decide later forfeits simultaneous issue pricing. Owner's Policies are significantly cheaper when issued at the same time as the lender's policy. This usually costs the buyer more." />
            )}

            {price > 0 && (
              <div style={{ background: 'var(--bg-1)', borderRadius: 10, padding: '16px', border: '1px solid var(--line-soft)', marginTop: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-mute)', marginBottom: 12 }}>
                  Ohio Pricing Estimate (approx.)
                </div>
                <div style={{ display: 'grid', gap: 8, fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: 'var(--ink-dim)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Owner's Policy ({fmtMoney(price)})</span>
                    <span>$1,500 – $2,200</span>
                  </div>
                  {form.financingType && form.financingType !== 'cash' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Simultaneous Issue (lender's policy)</span>
                      <span>$200 – $400</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Enhanced Homeowner's Policy (add-on)</span>
                    <span>+$300 – $600</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Nav buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--line-soft)' }}>
          <button
            onClick={() => {
              const idx = SECTIONS.findIndex(s => s.key === section);
              if (idx > 0) setSection(SECTIONS[idx - 1].key);
            }}
            disabled={section === SECTIONS[0].key}
            style={{
              padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'var(--bg-2)', border: '1px solid var(--line-soft)',
              color: section === SECTIONS[0].key ? 'var(--ink-faint)' : 'var(--ink-dim)',
              cursor: section === SECTIONS[0].key ? 'default' : 'pointer',
            }}
          >
            ← Previous
          </button>
          <div style={{ fontSize: 12, color: 'var(--ink-mute)', alignSelf: 'center' }}>
            {completedSections.length} / {SECTIONS.length} sections complete
          </div>
          <button
            onClick={() => {
              const idx = SECTIONS.findIndex(s => s.key === section);
              if (idx < SECTIONS.length - 1) setSection(SECTIONS[idx + 1].key);
            }}
            disabled={section === SECTIONS[SECTIONS.length - 1].key}
            style={{
              padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              background: 'var(--accent-soft)', border: '1px solid oklch(0.72 0.14 298 / 0.3)',
              color: section === SECTIONS[SECTIONS.length - 1].key ? 'var(--ink-faint)' : 'var(--accent-strong)',
              cursor: section === SECTIONS[SECTIONS.length - 1].key ? 'default' : 'pointer',
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </main>
  );
}
