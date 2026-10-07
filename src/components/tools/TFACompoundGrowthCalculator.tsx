import { useDeferredValue, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChevronDown, Mail, Table2, CalendarCheck, RotateCcw, ArrowUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import EmailResultsModal from "./EmailResultsModal";
import { generateCalculatorPdf } from "@/lib/calculatorPdfGenerator";
import { CurrencyInput } from "@/components/ui/currency-input";
import { NumericInput } from "@/components/ui/numeric-input";
import { PercentageInput } from "@/components/ui/percentage-input";
import { cn } from "@/lib/utils";

interface CalculatorInputs {
  initialInvestment: number;
  monthlyContribution: number;
  years: number;
  annualRate: number;
  compoundingFrequency: number;
  contributionTiming: "beginning" | "end";
}

interface CalculationResults {
  finalBalance: number;
  totalContributions: number;
  totalGrowth: number;
  yearlyData: { year: number; balance: number; contributions: number }[];
}

const DEFAULT_A: CalculatorInputs = {
  initialInvestment: 0,
  monthlyContribution: 250,
  years: 20,
  annualRate: 7,
  compoundingFrequency: 12,
  contributionTiming: "end",
};
const DEFAULT_B: CalculatorInputs = { ...DEFAULT_A, annualRate: 0 };

const calculateScenario = (s: CalculatorInputs): CalculationResults => {
  const P = Math.max(0, s.initialInvestment || 0);
  const PMT = Math.max(0, s.monthlyContribution || 0);
  const r = Math.max(0, Math.min(20, s.annualRate || 0)) / 100;
  const n = s.compoundingFrequency || 12;
  const t = Math.max(1, Math.min(50, s.years || 1));
  const yearlyData: CalculationResults["yearlyData"] = [];

  for (let year = 0; year <= t; year++) {
    const periods = n * year;
    const principalGrowth = P * Math.pow(1 + r / n, periods);
    const adjustedPMT = PMT * (12 / n);
    let contributionsGrowth = 0;
    if (periods > 0 && r > 0) {
      contributionsGrowth = adjustedPMT * ((Math.pow(1 + r / n, periods) - 1) / (r / n));
      if (s.contributionTiming === "beginning") contributionsGrowth *= 1 + r / n;
    } else if (periods > 0) {
      contributionsGrowth = adjustedPMT * periods;
    }
    const balance = principalGrowth + contributionsGrowth;
    yearlyData.push({
      year,
      balance: Math.round((isFinite(balance) ? balance : 0) * 100) / 100,
      contributions: Math.round((P + PMT * 12 * year) * 100) / 100,
    });
  }
  const finalBalance = yearlyData[yearlyData.length - 1]?.balance || 0;
  const totalContributions = P + PMT * 12 * t;
  return {
    finalBalance: isFinite(finalBalance) ? finalBalance : 0,
    totalContributions: isFinite(totalContributions) ? totalContributions : 0,
    totalGrowth: isFinite(finalBalance - totalContributions) ? finalBalance - totalContributions : 0,
    yearlyData,
  };
};

const fmt = (v: number) =>
  isFinite(v)
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v)
    : "$0";
const fmtShort = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `$${Math.round(v / 1000)}k` : `$${Math.round(v)}`;

const inputClass =
  "w-full h-12 rounded-xl bg-calc-raised border border-calc-line text-calc-ink text-base px-4 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold";

function Field({
  id,
  label,
  hint,
  children,
  slider,
}: {
  id: string;
  label: string;
  hint: string;
  children: React.ReactNode;
  slider: { value: number; min: number; max: number; step: number; onChange: (v: number) => void };
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-base font-semibold text-calc-ink">
        {label}
      </Label>
      {children}
      <Slider
        aria-label={label}
        value={[Math.min(slider.max, Math.max(slider.min, slider.value))]}
        min={slider.min}
        max={slider.max}
        step={slider.step}
        onValueChange={([v]) => slider.onChange(v)}
        className="py-2 [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:border-gold [&>span:first-child]:bg-calc-line [&>span:first-child>span]:bg-gold"
      />
      <p className="text-sm text-calc-muted">{hint}</p>
    </div>
  );
}

function ScenarioInputs({
  idPrefix,
  value,
  onChange,
}: {
  idPrefix: string;
  value: CalculatorInputs;
  onChange: (v: CalculatorInputs) => void;
}) {
  const set = (patch: Partial<CalculatorInputs>) => onChange({ ...value, ...patch });
  return (
    <div className="space-y-6">
      <Field
        id={`${idPrefix}-initial`}
        label="Starting amount"
        hint="What you have saved or invested today."
        slider={{ value: value.initialInvestment, min: 0, max: 500000, step: 1000, onChange: (v) => set({ initialInvestment: v }) }}
      >
        <CurrencyInput
          id={`${idPrefix}-initial`}
          value={value.initialInvestment}
          onChange={(v) => set({ initialInvestment: Math.max(0, v) })}
          min={0}
          className={inputClass}
        />
      </Field>
      <Field
        id={`${idPrefix}-monthly`}
        label="Monthly contribution"
        hint="How much you plan to add each month."
        slider={{ value: value.monthlyContribution, min: 0, max: 5000, step: 25, onChange: (v) => set({ monthlyContribution: v }) }}
      >
        <CurrencyInput
          id={`${idPrefix}-monthly`}
          value={value.monthlyContribution}
          onChange={(v) => set({ monthlyContribution: Math.max(0, v) })}
          min={0}
          className={inputClass}
        />
      </Field>
      <Field
        id={`${idPrefix}-years`}
        label="Years to grow"
        hint="Between 1 and 50 years."
        slider={{ value: value.years, min: 1, max: 50, step: 1, onChange: (v) => set({ years: v }) }}
      >
        <NumericInput
          id={`${idPrefix}-years`}
          value={value.years}
          onChange={(v) => set({ years: Math.max(1, Math.min(50, v)) })}
          min={1}
          max={50}
          className={inputClass}
        />
      </Field>
      <Field
        id={`${idPrefix}-rate`}
        label="Expected yearly return (%)"
        hint="A long-term average, 0% to 20%. Real returns vary."
        slider={{ value: value.annualRate, min: 0, max: 20, step: 0.5, onChange: (v) => set({ annualRate: v }) }}
      >
        <PercentageInput
          id={`${idPrefix}-rate`}
          value={value.annualRate}
          onChange={(v) => set({ annualRate: Math.max(0, Math.min(20, v)) })}
          min={0}
          max={20}
          className={inputClass}
        />
      </Field>
    </div>
  );
}

const TFACompoundGrowthCalculator = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_A);
  const [scenarioB, setScenarioB] = useState<CalculatorInputs>(DEFAULT_B);
  const [compareMode, setCompareMode] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const deferredA = useDeferredValue(inputs);
  const deferredB = useDeferredValue(scenarioB);
  const results = useMemo(() => calculateScenario(deferredA), [deferredA]);
  const resultsB = useMemo(() => calculateScenario(deferredB), [deferredB]);

  const chartData = useMemo(() => {
    const len = Math.max(results.yearlyData.length, compareMode ? resultsB.yearlyData.length : 0);
    return Array.from({ length: len }, (_, i) => ({
      year: i,
      balance: results.yearlyData[i]?.balance,
      contributions: results.yearlyData[i]?.contributions,
      balanceB: compareMode ? resultsB.yearlyData[i]?.balance : undefined,
    }));
  }, [results, resultsB, compareMode]);

  const growthShare =
    results.finalBalance > 0 ? Math.max(0, Math.min(100, (results.totalGrowth / results.finalBalance) * 100)) : 0;

  const handleReset = () => {
    setInputs(DEFAULT_A);
    setScenarioB(DEFAULT_B);
    setCompareMode(false);
    setShowTable(false);
  };

  const handleEmailResults = async (email: string, firstName: string) => {
    setEmailLoading(true);
    try {
      const pdfInputs = [
        { label: "Initial Investment", value: fmt(inputs.initialInvestment) },
        { label: "Monthly Contribution", value: fmt(inputs.monthlyContribution) },
        { label: "Time Horizon", value: `${inputs.years} years` },
        { label: "Annual Return Rate", value: `${inputs.annualRate}%` },
      ];
      const pdfResults = [
        { label: "PROJECTED BALANCE", value: fmt(results.finalBalance), highlight: true },
        { label: "Total Contributions", value: fmt(results.totalContributions) },
        { label: "Total Growth", value: fmt(results.totalGrowth) },
      ];
      const pdfBase64 = generateCalculatorPdf({
        calculatorName: "Compound Growth Calculator",
        inputs: pdfInputs,
        results: pdfResults,
        insights: [
          "Compound growth accelerates over time - the earlier you start, the more you benefit.",
          "Consistent monthly contributions can significantly boost your final balance.",
        ],
      });
      const { error } = await supabase.functions.invoke("send-calculator-results", {
        body: {
          email,
          firstName,
          calculatorName: "Compound Growth Calculator",
          pdfBase64,
          resultsSummary: pdfResults.map((r) => ({ label: r.label, value: r.value })),
        },
      });
      if (error) throw error;
      toast.success("Results sent to your email!");
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again.");
      throw error;
    } finally {
      setEmailLoading(false);
    }
  };

  const scrollToResults = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resultsRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  const card = "rounded-2xl bg-calc-surface border border-calc-line p-5 sm:p-7 text-calc-ink";

  return (
    <div className="w-full pb-24 lg:pb-0">
      <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-6 lg:gap-10 items-start">
        {/* Inputs */}
        <div className="space-y-6">
          <section className={card} aria-labelledby="inputs-heading">
            <div className="flex items-center justify-between gap-3 mb-6">
              <div>
                <h2 id="inputs-heading" className="text-xl font-bold">
                  {compareMode ? "Plan A — your plan" : "Your numbers"}
                </h2>
                <p className="text-sm text-calc-muted mt-1">Results update as you type.</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                className="h-11 text-calc-muted hover:text-calc-ink hover:bg-calc-raised"
              >
                <RotateCcw className="h-4 w-4 mr-2" /> Reset
              </Button>
            </div>

            <ScenarioInputs idPrefix="a" value={inputs} onChange={setInputs} />

            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              aria-expanded={showMore}
              className="mt-6 w-full flex items-center justify-between min-h-11 rounded-xl px-4 bg-calc-raised border border-calc-line text-calc-ink font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              More options
              <ChevronDown className={cn("h-5 w-5 transition-transform motion-reduce:transition-none", showMore && "rotate-180")} />
            </button>

            {showMore && (
              <div className="mt-5 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="frequency" className="text-base font-semibold text-calc-ink">
                    How often growth is added
                  </Label>
                  <Select
                    value={inputs.compoundingFrequency.toString()}
                    onValueChange={(v) => setInputs({ ...inputs, compoundingFrequency: Number(v) })}
                  >
                    <SelectTrigger id="frequency" className={inputClass}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Yearly</SelectItem>
                      <SelectItem value="2">Twice a year</SelectItem>
                      <SelectItem value="4">Quarterly</SelectItem>
                      <SelectItem value="12">Monthly</SelectItem>
                      <SelectItem value="365">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <fieldset className="space-y-2">
                  <legend className="text-base font-semibold text-calc-ink mb-2">When you contribute</legend>
                  <RadioGroup
                    value={inputs.contributionTiming}
                    onValueChange={(v: "beginning" | "end") => setInputs({ ...inputs, contributionTiming: v })}
                    className="gap-2"
                  >
                    {[
                      { v: "beginning", l: "Start of each month" },
                      { v: "end", l: "End of each month" },
                    ].map((o) => (
                      <Label
                        key={o.v}
                        htmlFor={`timing-${o.v}`}
                        className="flex items-center gap-3 min-h-11 px-4 rounded-xl bg-calc-raised border border-calc-line cursor-pointer text-calc-ink font-normal"
                      >
                        <RadioGroupItem value={o.v} id={`timing-${o.v}`} className="border-gold text-gold" />
                        {o.l}
                      </Label>
                    ))}
                  </RadioGroup>
                </fieldset>

                <div className="flex items-center justify-between gap-4 rounded-xl bg-calc-raised border border-calc-line px-4 py-3">
                  <div>
                    <Label htmlFor="compare-toggle" className="text-base font-semibold text-calc-ink cursor-pointer">
                      Compare with a second plan
                    </Label>
                    <p className="text-sm text-calc-muted">See two plans side by side on the chart.</p>
                  </div>
                  <Switch
                    id="compare-toggle"
                    checked={compareMode}
                    onCheckedChange={(c) => {
                      setCompareMode(c);
                      if (c) setScenarioB({ ...DEFAULT_B, monthlyContribution: inputs.monthlyContribution, years: inputs.years });
                    }}
                    className="data-[state=checked]:bg-gold"
                  />
                </div>
              </div>
            )}
          </section>

          {compareMode && (
            <section className={card} aria-labelledby="planb-heading">
              <h2 id="planb-heading" className="text-xl font-bold mb-1">Plan B — compare with</h2>
              <p className="text-sm text-calc-muted mb-6">Starts as the same savings with no growth. Change anything.</p>
              <ScenarioInputs idPrefix="b" value={scenarioB} onChange={setScenarioB} />
            </section>
          )}
        </div>

        {/* Results */}
        <div ref={resultsRef} className="space-y-6 lg:sticky lg:top-24 scroll-mt-24" aria-live="polite">
          <section className={card} aria-labelledby="results-heading">
            <p id="results-heading" className="text-sm font-semibold uppercase tracking-wide text-gold">
              Projected balance in {inputs.years} {inputs.years === 1 ? "year" : "years"}
            </p>
            <p className="text-4xl sm:text-5xl font-bold mt-2 tabular-nums">{fmt(results.finalBalance)}</p>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="rounded-xl bg-calc-raised p-4">
                <p className="text-sm text-calc-muted flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-calc-muted" aria-hidden /> You put in
                </p>
                <p className="text-xl sm:text-2xl font-semibold mt-1 tabular-nums">{fmt(results.totalContributions)}</p>
              </div>
              <div className="rounded-xl bg-calc-raised p-4">
                <p className="text-sm text-calc-muted flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-gold" aria-hidden /> Growth earned
                </p>
                <p className="text-xl sm:text-2xl font-semibold mt-1 tabular-nums text-gold">{fmt(results.totalGrowth)}</p>
              </div>
            </div>

            <div
              className="mt-4 h-3 w-full rounded-full bg-calc-muted overflow-hidden"
              role="img"
              aria-label={`Growth makes up ${Math.round(growthShare)}% of your balance`}
            >
              <div className="h-full bg-gold ml-auto" style={{ width: `${growthShare}%` }} />
            </div>
            <p className="text-sm text-calc-muted mt-2">
              Growth makes up <span className="text-calc-ink font-semibold">{Math.round(growthShare)}%</span> of your balance.
            </p>

            {compareMode && (
              <div className="mt-6 rounded-xl border border-gold/50 p-4">
                <p className="text-sm text-calc-muted">Plan B ends at <span className="text-calc-ink font-semibold">{fmt(resultsB.finalBalance)}</span></p>
                <p className="text-lg font-semibold mt-1">
                  Plan A is {results.finalBalance >= resultsB.finalBalance ? "ahead" : "behind"} by{" "}
                  <span className="text-gold tabular-nums">{fmt(Math.abs(results.finalBalance - resultsB.finalBalance))}</span>
                </p>
              </div>
            )}
          </section>

          <section className={card} aria-labelledby="chart-heading">
            <h3 id="chart-heading" className="text-lg font-semibold mb-4">Growth over time</h3>
            <div className="h-64 sm:h-72 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--calc-line))" />
                  <XAxis
                    dataKey="year"
                    stroke="hsl(var(--calc-muted))"
                    tick={{ fill: "hsl(var(--calc-muted))", fontSize: 13 }}
                    tickFormatter={(v) => `Yr ${v}`}
                  />
                  <YAxis
                    stroke="hsl(var(--calc-muted))"
                    tick={{ fill: "hsl(var(--calc-muted))", fontSize: 13 }}
                    tickFormatter={fmtShort}
                    width={56}
                  />
                  <Tooltip
                    formatter={(v: number) => fmt(v)}
                    labelFormatter={(l) => `Year ${l}`}
                    contentStyle={{
                      background: "hsl(var(--calc-raised))",
                      border: "1px solid hsl(var(--calc-line))",
                      borderRadius: 12,
                      color: "hsl(var(--calc-ink))",
                      fontSize: 14,
                    }}
                    labelStyle={{ color: "hsl(var(--calc-ink))", fontWeight: 600 }}
                  />
                  <Legend wrapperStyle={{ color: "hsl(var(--calc-muted))", fontSize: 13 }} />
                  <Line type="monotone" dataKey="balance" name={compareMode ? "Plan A balance" : "Balance"} stroke="hsl(var(--gold))" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="contributions" name="You put in" stroke="hsl(var(--calc-muted))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  {compareMode && (
                    <Line type="monotone" dataKey="balanceB" name="Plan B balance" stroke="hsl(var(--calc-ink))" strokeWidth={2} dot={false} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="grid sm:grid-cols-3 gap-3">
            <Button onClick={() => setEmailModalOpen(true)} className="h-12 bg-gold text-navy hover:bg-gold-light font-semibold">
              <Mail className="h-4 w-4 mr-2" /> Email my results
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowTable((v) => !v)}
              aria-expanded={showTable}
              className="h-12 bg-calc-surface border-calc-line text-calc-ink hover:bg-calc-raised hover:text-calc-ink"
            >
              <Table2 className="h-4 w-4 mr-2" /> {showTable ? "Hide" : "Year-by-year"}
            </Button>
            <Button asChild variant="outline" className="h-12 bg-calc-surface border-calc-line text-calc-ink hover:bg-calc-raised hover:text-calc-ink">
              <Link to="/book-consultation">
                <CalendarCheck className="h-4 w-4 mr-2" /> Talk to an advisor
              </Link>
            </Button>
          </div>

          {showTable && (
            <section className={cn(card, "p-0 sm:p-0 overflow-hidden")} aria-label="Year-by-year balances">
              <div className="max-h-96 overflow-auto">
                <table className="w-full text-sm tabular-nums">
                  <thead className="sticky top-0 bg-calc-raised text-calc-muted">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Year</th>
                      <th className="text-right px-4 py-3 font-semibold">You put in</th>
                      <th className="text-right px-4 py-3 font-semibold">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearlyData.map((r) => (
                      <tr key={r.year} className="border-t border-calc-line">
                        <td className="px-4 py-2.5">{r.year}</td>
                        <td className="px-4 py-2.5 text-right">{fmt(r.contributions)}</td>
                        <td className="px-4 py-2.5 text-right font-semibold">{fmt(r.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Mobile sticky summary */}
      <button
        type="button"
        onClick={scrollToResults}
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-between gap-3 px-4 py-3 bg-calc-surface border-t border-calc-line text-calc-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        aria-label={`Projected balance ${fmt(results.finalBalance)}. Jump to results`}
      >
        <span className="text-left">
          <span className="block text-xs uppercase tracking-wide text-gold font-semibold">Projected balance</span>
          <span className="block text-xl font-bold tabular-nums">{fmt(results.finalBalance)}</span>
        </span>
        <span className="flex items-center gap-1 text-sm text-calc-muted">
          See results <ArrowUp className="h-4 w-4" />
        </span>
      </button>

      <EmailResultsModal
        open={emailModalOpen}
        onOpenChange={setEmailModalOpen}
        onSendEmail={handleEmailResults}
        isLoading={emailLoading}
        calculatorName="Compound Growth Calculator"
      />
    </div>
  );
};

export default TFACompoundGrowthCalculator;
