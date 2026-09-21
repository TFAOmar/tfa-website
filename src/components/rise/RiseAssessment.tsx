import { useMemo, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { RISE_QUESTIONS, RISE_SERVICES, type RiseQuestion } from "@/data/riseLandingContent";

interface Props {
  answers: Record<string, string>;
  setAnswers: (a: Record<string, string>) => void;
  interests: string[];
  setInterests: (i: string[]) => void;
  onFinish: () => void;
}

const RiseAssessment = ({ answers, setAnswers, interests, setInterests, onFinish }: Props) => {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const visible: RiseQuestion[] = useMemo(
    () => RISE_QUESTIONS.filter((q) => !q.skipIf || !q.skipIf(answers)),
    [answers],
  );

  const q = visible[Math.min(step, visible.length - 1)];
  const progress = Math.round(((step + 1) / visible.length) * 100);

  const advance = () => {
    if (step + 1 < visible.length) setStep(step + 1);
    else {
      setDone(true);
      onFinish();
    }
  };

  const choose = (value: string) => {
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    const add = q.interestOn?.filter((r) => r.value === value).map((r) => r.interest) ?? [];
    if (add.length) setInterests(Array.from(new Set([...interests, ...add])));
    advance();
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  if (done) {
    const selected = RISE_SERVICES.filter((s) => interests.includes(s.id));
    return (
      <div className="rounded-2xl border border-navy/10 bg-card p-6 sm:p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Your summary</p>
        <h3 className="mt-2 font-serif text-2xl font-bold text-navy">Here's what you told us</h3>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Based on your answers, these are the areas people in your situation usually want to talk
          through first. Nothing here is a determination about your plan — it's simply where the
          conversation could start.
        </p>

        <ul className="mt-6 space-y-3">
          {(selected.length ? selected : RISE_SERVICES.filter((s) => s.primary)).map((s) => (
            <li key={s.id} className="flex items-start gap-3 rounded-xl bg-secondary/60 p-4">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-gold" aria-hidden />
              <div>
                <p className="font-semibold text-navy">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-muted-foreground">
          You choose what you'd like to discuss — these topics are pre-selected in the form below and
          can be changed.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <a
            href="#rise-intake"
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-navy px-6 font-semibold text-primary-foreground transition hover:bg-navy-light"
          >
            Continue to the form
          </a>
          <button
            type="button"
            onClick={() => {
              setDone(false);
              setStep(0);
            }}
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-navy/20 px-6 font-medium text-navy transition hover:border-gold"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-navy/10 bg-card p-6 sm:p-8 shadow-sm">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>
          Question {step + 1} of {visible.length}
        </span>
        <span>{progress}%</span>
      </div>
      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gold transition-all duration-300 motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h3 className="mt-6 font-serif text-xl sm:text-2xl font-bold text-navy">{q.question}</h3>
      {q.helper && <p className="mt-2 text-sm text-muted-foreground">{q.helper}</p>}

      <div className="mt-5 space-y-3">
        {q.options.map((opt) => {
          const active = answers[q.id] === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => choose(opt.value)}
              aria-pressed={active}
              className={`flex min-h-[52px] w-full items-center justify-between rounded-xl border-2 px-5 py-3 text-left font-medium text-navy transition hover:border-gold hover:shadow-sm motion-reduce:transition-none ${
                active ? "border-gold bg-gold/5" : "border-border bg-background"
              }`}
            >
              {opt.label}
              {active && <Check className="h-4 w-4 text-gold" aria-hidden />}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-navy disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back
        </button>
        <button
          type="button"
          onClick={advance}
          className="min-h-[44px] rounded-lg px-2 text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-navy"
        >
          Skip this question
        </button>
      </div>
    </div>
  );
};

export default RiseAssessment;
