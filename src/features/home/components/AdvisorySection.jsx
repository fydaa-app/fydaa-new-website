import Image from "next/image";
import BookCallForm from './BookCallForm';

export default function AdvisorySection() {
  return (
    <section className="advisory" id="book-a-call">
      <div className="container">
        <div className="advisory-grid">
          <div className="advisory-text">
            <div className="advisory-visual">
              <Image
                src="/home/advisory/advisor-chat.png"
                alt="Fydaa relationship manager chatting with a client about SIPs and goals"
                width={866}
                height={308}
                sizes="(min-width: 1024px) 520px, 100vw"
                className="advisory-visual-img"
              />
            </div>
            <h2>
              Not just an app.
              <br />
              <span className="serif">Real people</span> behind your money.
            </h2>
            <p className="advisory-sub">
              Fydaa combines digital financial tools with human guidance. Relationship managers can understand your goals, answer questions and help you make informed decisions when you need support.
            </p>
          </div>

          <div className="advisory-form-wrap">
            <div className="advisory-form-card">
              <BookCallForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
