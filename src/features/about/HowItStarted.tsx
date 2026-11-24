import { Container } from "@/components/layout/container";

/** The gap Fydaa set out to close, in figures. */
const FIGURES = [
  { value: "70%", label: "rely on unverified advice or a random app" },
  { value: "92%", label: "of millennials say they want to invest but don't know how" },
  { value: "27%", label: "is the financial literacy rate in India" },
  { value: "3%", label: "of Indians invest in mutual funds" },
];

/** Why Fydaa exists: the mission on the left, the problem as large figures on the right. */
export default function HowItStarted() {
  return (
    <section aria-labelledby="mission-title" className="section bg-mist">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
        <div className="flex flex-col gap-4">
          <h2 id="mission-title" className="max-w-[14ch] text-heading text-ink">
            Why we started Fydaa
          </h2>
          <p className="max-w-[46ch] text-pretty text-lead text-grey-600">
            So that everyone, whatever their income or background, can build wealth and share in the
            country&apos;s growth. These numbers are where we started.
          </p>
        </div>
        <ul className="grid gap-x-10 sm:grid-cols-2">
          {FIGURES.map((item) => (
            <li key={item.value} className="flex flex-col gap-2 border-t border-line py-6">
              <span className="figure text-figure text-ink">{item.value}</span>
              <span className="max-w-[28ch] text-base leading-relaxed text-grey-600">{item.label}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
