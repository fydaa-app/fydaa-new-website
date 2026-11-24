import { Container } from "@/components/layout/container";

/** The last word before the footer: no role that fits yet, so leave a CV. */
export default function RegisterCvCta({ onRegisterCv }: { onRegisterCv: () => void }) {
  return (
    <section aria-labelledby="register-cv-cta-title" className="section">
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-4">
          <h2 id="register-cv-cta-title" className="max-w-[16ch] text-heading text-ink">
            Don&apos;t see the right role yet?
          </h2>
          <p className="max-w-[46ch] text-lead text-grey-600">
            Register your CV. When a role that matches your profile opens, our team will reach out.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={onRegisterCv} data-ph-event="Register your CV" className="btn btn-primary btn-lg">
            Register your CV
          </button>
        </div>
      </Container>
    </section>
  );
}
