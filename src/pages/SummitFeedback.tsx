import { useEffect, useRef, useState, KeyboardEvent, FormEvent } from "react";
import { Check, Star } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { useHoneypot, honeypotClassName } from "@/hooks/useHoneypot";
import tfaLogo from "@/assets/tfa-logo.png";

const SUMMIT_FEEDBACK_WEBHOOK = "https://hook.us2.make.com/hmd3oe10t86qau2unmfehxvsd1u4lr8n";
const FEEDBACK_CLOSES_AT = "2026-10-22T23:59:00-07:00";

const VALUE_OPTIONS = ["Extremely valuable", "Very valuable", "Somewhat valuable", "Not very valuable"];
const MOST_OPTIONS = [
  "Guest speakers",
  "Leadership & business development",
  "Sales/industry education",
  "Networking & community",
  "Overall experience",
];
const ATTEND_OPTIONS = ["Absolutely", "Most likely", "Maybe", "No"];
const MAX_MORE = 500;

type Field = "rating" | "value" | "most_valuable" | "attend_again";
const FIELD_ORDER: Field[] = ["rating", "value", "most_valuable", "attend_again"];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

async function postOnce(body: unknown): Promise<boolean> {
  try {
    const res = await fetch(SUMMIT_FEEDBACK_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function ChoiceGroup({
  name,
  legend,
  options,
  value,
  onChange,
  error,
  legendRef,
}: {
  name: Field;
  legend: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error: boolean;
  legendRef: (el: HTMLElement | null) => void;
}) {
  const errId = `${name}-error`;
  return (
    <fieldset
      className="space-y-2"
      aria-invalid={error || undefined}
      aria-describedby={error ? errId : undefined}
    >
      <legend
        ref={legendRef}
        tabIndex={-1}
        className="mb-3 text-base font-semibold text-foreground focus:outline-none"
      >
        {legend}
      </legend>
      {options.map((opt, i) => {
        const selected = value === opt;
        const id = `${name}-${i}`;
        return (
          <label
            key={opt}
            htmlFor={id}
            className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors motion-reduce:transition-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${
              selected ? "border-accent border-2 bg-accent/15 font-medium text-foreground" : "border-border bg-card text-foreground hover:bg-muted/60"
            }`}
          >
            <input
              id={id}
              type="radio"
              name={name}
              value={opt}
              checked={selected}
              onChange={() => onChange(opt)}
              aria-invalid={error || undefined}
              className="sr-only"
            />
            <span
              aria-hidden="true"
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
              }`}
            >
              {selected && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
            <span className="flex-1">{opt}</span>
          </label>
        );
      })}
      {error && (
        <p id={errId} className="pt-1 text-sm text-[hsl(0_70%_40%)]">
          Please choose an answer
        </p>
      )}
    </fieldset>
  );
}

const SummitFeedback = () => {
  const [isClosed] = useState(() => Date.now() > new Date(FEEDBACK_CLOSES_AT).getTime());
  const [rating, setRating] = useState(0);
  const [value, setValue] = useState("");
  const [mostValuable, setMostValuable] = useState("");
  const [attendAgain, setAttendAgain] = useState("");
  const [moreOf, setMoreOf] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [done, setDone] = useState(false);
  const sendingRef = useRef(false);
  const legendRefs = useRef<Record<Field, HTMLElement | null>>({
    rating: null, value: null, most_valuable: null, attend_again: null,
  });
  const starRefs = useRef<(HTMLInputElement | null)[]>([]);
  const thanksRef = useRef<HTMLHeadingElement>(null);
  const { honeypotProps, isBot } = useHoneypot();

  useEffect(() => {
    if (done) thanksRef.current?.focus();
  }, [done]);

  const answers: Record<Field, boolean> = {
    rating: rating > 0,
    value: !!value,
    most_valuable: !!mostValuable,
    attend_again: !!attendAgain,
  };
  const showErr = (f: Field) => attempted && !answers[f];

  const onStarKey = (e: KeyboardEvent<HTMLInputElement>, n: number) => {
    let next = n;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(5, n + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(1, n - 1);
    else if (e.key === "Home") next = 1;
    else if (e.key === "End") next = 5;
    else return;
    e.preventDefault();
    setRating(next);
    starRefs.current[next - 1]?.focus();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (sendingRef.current) return;
    setAttempted(true);
    setFailed(false);

    const firstMissing = FIELD_ORDER.find((f) => !answers[f]);
    if (firstMissing) {
      if (firstMissing === "rating") starRefs.current[0]?.focus();
      else {
        const el = legendRefs.current[firstMissing];
        el?.closest("fieldset")?.querySelector<HTMLInputElement>("input")?.focus();
      }
      return;
    }

    if (isBot()) {
      setDone(true);
      return;
    }

    sendingRef.current = true;
    setSending(true);
    try {
      const src = new URLSearchParams(window.location.search).get("src") || "direct";
      const body = {
        submitted_at: new Date().toLocaleString("en-US", {
          timeZone: "America/Los_Angeles",
          month: "numeric", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
        }),
        rating,
        value,
        most_valuable: mostValuable,
        attend_again: attendAgain,
        more_of: moreOf.trim(),
        src,
      };
      let ok = await postOnce(body);
      if (!ok) {
        await new Promise((r) => setTimeout(r, 1500));
        ok = await postOnce(body);
      }
      if (ok) setDone(true);
      else setFailed(true);
    } finally {
      sendingRef.current = false;
      setSending(false);
    }
  };

  const status = sending
    ? "Sending your feedback…"
    : failed
    ? "We couldn't send your feedback. Check your connection and tap Submit again."
    : done
    ? "Thank you! Your feedback was sent."
    : "";

  return (
    <div className="min-h-dvh bg-[hsl(35_30%_96%)]">
      <SEOHead
        title="Summit Feedback"
        description="Share quick feedback on the TFA Q3 Leadership Summit 2026."
        canonical="https://tfawealthplanning.com/summit-feedback"
        noIndex
      />

      <header className="bg-primary px-4 pb-14 pt-8 text-primary-foreground">
        <div className="mx-auto max-w-[560px]">
          <img src={tfaLogo} alt="The Financial Architects" width={120} height={32} className="h-8 w-auto rounded bg-card px-2 py-1" />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
            Q3 Leadership Summit 2026
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight">Quick Feedback</h1>
          <p className="mt-2 text-sm text-primary-foreground/85">
            Takes less than a minute. Thank you for being here.
          </p>
        </div>
      </header>

      <main className="px-4 pb-12">
        <div className="mx-auto -mt-8 max-w-[560px] rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
          <div aria-live="polite" className="sr-only">{status}</div>

          {isClosed ? (
            <p className="text-base text-foreground">
              Feedback for the Q3 Leadership Summit is closed. Thank you to everyone who shared their thoughts.
            </p>
          ) : done ? (
            <div className="py-4 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground" aria-hidden="true">
                <Check className="h-6 w-6" strokeWidth={3} />
              </div>
              <h2 ref={thanksRef} tabIndex={-1} className="text-2xl font-bold text-foreground focus:outline-none">
                Thank you!
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Thank you for your feedback! Your input helps us continue creating better experiences, stronger education, and more value for our TFA community.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              <div className={honeypotClassName} aria-hidden="true">
                <label htmlFor="summit_hp_ref">Leave blank</label>
                <input id="summit_hp_ref" name="summit_hp_ref" type="text" {...honeypotProps} autoComplete="new-password" data-lpignore="true" data-1p-ignore="true" />
              </div>

              {/* 1. Stars */}
              <fieldset aria-invalid={showErr("rating") || undefined} aria-describedby={showErr("rating") ? "rating-error" : undefined}>
                <legend ref={(el) => { legendRefs.current.rating = el; }} className="mb-3 text-base font-semibold text-foreground">
                  Overall, how would you rate today's Leadership Summit?
                </legend>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => {
                      const filled = n <= rating;
                      return (
                        <label
                          key={n}
                          className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                        >
                          <input
                            ref={(el) => { starRefs.current[n - 1] = el; }}
                            type="radio"
                            name="rating"
                            value={n}
                            checked={rating === n}
                            tabIndex={rating === n || (rating === 0 && n === 1) ? 0 : -1}
                            onChange={() => setRating(n)}
                            onKeyDown={(e) => onStarKey(e, n)}
                            aria-label={`${n} star${n > 1 ? "s" : ""}`}
                            aria-invalid={showErr("rating") || undefined}
                            className="sr-only"
                          />
                          <Star
                            aria-hidden="true"
                            className={`h-9 w-9 transition-colors motion-reduce:transition-none ${filled ? "fill-accent text-primary" : "text-muted-foreground"}`}
                            strokeWidth={1.5}
                          />
                        </label>
                      );
                    })}
                  </div>
                  <span className="text-sm font-medium text-foreground" aria-hidden="true">
                    {rating > 0 ? `${rating} of 5` : ""}
                  </span>
                </div>
                {showErr("rating") && (
                  <p id="rating-error" className="pt-2 text-sm text-[hsl(0_70%_40%)]">Please choose an answer</p>
                )}
              </fieldset>

              <ChoiceGroup name="value" legend="How valuable was today's content to you and your business?"
                options={VALUE_OPTIONS} value={value} onChange={setValue} error={showErr("value")}
                legendRef={(el) => { legendRefs.current.value = el; }} />
              <ChoiceGroup name="most_valuable" legend="What did you find MOST valuable today?"
                options={MOST_OPTIONS} value={mostValuable} onChange={setMostValuable} error={showErr("most_valuable")}
                legendRef={(el) => { legendRefs.current.most_valuable = el; }} />
              <ChoiceGroup name="attend_again" legend="Would you attend another TFA Leadership Summit?"
                options={ATTEND_OPTIONS} value={attendAgain} onChange={setAttendAgain} error={showErr("attend_again")}
                legendRef={(el) => { legendRefs.current.attend_again = el; }} />

              <div>
                <label htmlFor="more_of" className="mb-3 block text-base font-semibold text-foreground">
                  What would you like to see MORE of at our next Leadership Summit?{" "}
                  <span className="font-normal text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="more_of"
                  rows={3}
                  maxLength={MAX_MORE}
                  value={moreOf}
                  onChange={(e) => setMoreOf(e.target.value.slice(0, MAX_MORE))}
                  aria-describedby="more_of_count"
                  className={`w-full rounded-lg border border-input bg-card px-3 py-2 text-base text-foreground ${focusRing}`}
                />
                <p id="more_of_count" className="mt-1 text-right text-xs text-muted-foreground">
                  {moreOf.length}/{MAX_MORE}
                </p>
              </div>

              <div>
                {failed && (
                  <p className="mb-3 text-sm text-[hsl(0_70%_40%)]">
                    We couldn't send your feedback. Check your connection and tap Submit again.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className={`min-h-12 w-full rounded-lg bg-primary px-4 py-3 text-base font-semibold text-primary-foreground disabled:opacity-70 ${focusRing}`}
                >
                  {sending ? "Sending…" : "Submit feedback"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default SummitFeedback;
