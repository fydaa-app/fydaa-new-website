import BookCallForm from './BookCallForm';

export default function AdvisorySection() {
  return (
    <section className="advisory" id="book-a-call">
      <div className="container">
        <div className="advisory-grid">
          <div className="advisory-text">
            <div className="advisory-visual">
              <img
                src="/home/advisory/advisor-chat.png"
                alt="Fydaa relationship manager chatting with a client about SIPs and goals"
                className="advisory-visual-img"
              />
            </div>
            <h2>
              Not just an app.
              <br />
              <span className="serif">Real people</span> behind your money.
            </h2>
            <p className="advisory-sub">
              <span className="advisory-sub-line">
                Fydaa combines digital financial tools with human guidance. Relationship managers can
              </span>
              <span className="advisory-sub-line">
                understand your goals, answer questions and help you make informed decisions when you need support.
              </span>
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
