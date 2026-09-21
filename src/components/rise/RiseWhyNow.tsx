import RiseReveal from "./RiseReveal";

/** DRAFT COPY — pending compliance review. */
const POINTS = [
  "A home is usually the largest thing a family owns. Without a plan, it can end up in probate, a court process that is public, slow, and costly.",
  "An existing trust doesn't automatically include a new home. The home has to be titled into it.",
  "A plan covers more than the house: who makes decisions if you can't, and who cares for your children.",
];

const RiseWhyNow = () => (
  <section className="px-5 py-12 sm:py-16">
    <RiseReveal className="mx-auto max-w-3xl">
      <h2 className="font-serif text-2xl font-bold text-navy sm:text-3xl">Why now</h2>
      <div className="mt-6 space-y-6 border-l border-navy/15 pl-5 sm:pl-6">
        {POINTS.map((p) => (
          <p key={p} className="text-base leading-relaxed text-foreground/85 sm:text-lg">
            {p}
          </p>
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Educational information only — not legal advice.
      </p>
    </RiseReveal>
  </section>
);

export default RiseWhyNow;
