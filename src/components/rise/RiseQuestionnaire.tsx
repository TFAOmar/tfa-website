import { useMemo, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { visibleQuestions, type RiseAnswers } from "@/lib/rise/questions";
import { buildRiseSummary } from "@/lib/rise/summary";
import RiseSummaryContact from "./RiseSummaryContact";
import RiseReveal from "./RiseReveal";

const RiseQuestionnaire = () => {
  const [answers, setAnswers] = useState<RiseAnswers>({});
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [fading, setFading] = useState(false);

  const visible = useMemo(() => visibleQuestions(answers), [answers]);
  const q = visible[Math.min(step, visible.length - 1)];
  const progress = Math.round(((step + (done ? 1 : 0)) / visible.length) * 100);

  const transition = (fn: () => void) => {
    setFading(true);
    window.setTimeout(() => {
      fn();
      setFading(false);
    }, 140);
  };

  const advance = () =>
    transition(() => {
      if (step + 1 < visible.length) setStep(step + 1);
      else setDone(true);
    });

  const choose = (value: string) => {
    if (q.multi) {
      const current = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [q.id]: next });
      return;
    }
    setAnswers({ ...answers, [q.id]: value });
    advance();
  };

  const isSelected = (value: string) => {
    const a = answers[q.id];
    return Array.isArray(a) ? a.includes(value) : a === value;
  };

  const summary = buildRiseSummary(answers);

  if (done) {
    return (
      <section id="rise-questionnaire" className="scroll-mt-20 px-5 py-12 sm:py-16">
        <RiseReveal className="mx-auto max-w-2xl">
          <RiseSummaryContact
            answers={answers}
            summary={summary}
            onRestart={() => {
              setAnswers({});
              setStep(0);
              setDone(false);
            }}
          />
        </RiseReveal>
      </section>
    );
  }

  return (
    <section id="rise-questionnaire" className="scroll-mt-20 px-5 py-12 sm:py-16">
      <RiseReveal className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-[var(--rise-card-border)] bg-[var(--rise-card)] p-6 shadow-[0_8px_24px_-12px_rgba(28,43,69,0.25)] sm:p-8">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Question {step + 1}</span>
            <span>{Math.max(progress, 0)}%</span>
          </div>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full transition-all duration-300 motion-reduce:transition-none"
              style={{ width: `${Math.max(progress, 4)}%`, backgroundColor: "var(--rise-accent)" }}
            />
          </div>

          <div
            className={`transition-opacity duration-150 motion-reduce:transition-none ${
              fading ? "opacity-0" : "opacity-100"
            }`}
          >
            <h2 className="mt-6 font-serif text-xl font-bold text-navy sm:text-2xl">
              {q.question}
            </h2>
            {q.helper && <p className="mt-2 text-sm text-muted-foreground">{q.helper}</p>}

            <div className="mt-5 space-y-3">
              {q.options.map((opt) => {
                const active = isSelected(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => choose(opt.value)}
                    aria-pressed={active}
                    className="flex min-h-[52px] w-full items-center justify-between rounded-xl border-2 px-5 py-3 text-left font-medium text-navy transition motion-reduce:transition-none"
                    style={{
                      borderColor: active ? "var(--rise-accent)" : "hsl(var(--border))",
                      backgroundColor: active ? "var(--rise-accent-soft)" : "transparent",
                    }}
                  >
                    {opt.label}
                    {active && (
                      <Check className="h-4 w-4" style={{ color: "var(--rise-accent)" }} aria-hidden />
                    )}
                  </button>
                );
              })}
            </div>

            {q.multi && (
              <button
                type="button"
                onClick={advance}
                className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center rounded-xl px-6 font-semibold transition hover:opacity-90 motion-reduce:transition-none"
                style={{
                  backgroundColor: "var(--rise-accent)",
                  color: "var(--rise-accent-contrast)",
                }}
              >
                Continue
              </button>
            )}
          </div>

          <div className="mt-6 flex items-center">
            <button
              type="button"
              onClick={() => step > 0 && transition(() => setStep(step - 1))}
              disabled={step === 0}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-navy disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden /> Back
            </button>
          </div>
        </div>
      </RiseReveal>
    </section>
  );
};

export default RiseQuestionnaire;
