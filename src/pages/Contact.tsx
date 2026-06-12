import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("There was a problem submitting your message.");
      }

      setSubmitted(true);
      form.reset();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "There was a problem submitting your message."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="p-4 p-md-5 bg-secondary div-contact-form">
      <div className="d-flex flex-wrap gap-3 size-contact-form justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Contact Us</h1>
        <button
          type="button"
          className="btn btn-dark text-white"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>

      {submitted ? (
        <div className="alert alert-success size-contact-form text-center">
          Thanks for your message! We'll get back to you soon.
        </div>
      ) : (
        <form
          action="https://formspree.io/f/xanjvkjq"
          method="POST"
          onSubmit={handleSubmit}
          className="size-contact-form"
        >
          <p className="text-dark">
            Let us know if you have any questions or feedback.
          </p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="name" className="form-label text-dark">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              autoComplete="name"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label text-dark">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label text-dark">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              className="form-control"
              rows={4}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </form>
      )}
    </main>
  );
};

export default Contact;
