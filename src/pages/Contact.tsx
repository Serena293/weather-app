import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      setSubmitted(true);
      form.reset();
    } else {
      alert("Oops! There was a problem submitting your form");
    }
  };

  return (
    
    <div className="p-5 bg-secondary div-contact-form">
  <div className="d-flex size-contact-form justify-content-between align-items-center mb-4">
    <h1 className="mb-0">Contact Us</h1>
    <button
      className="btn btn-outline-secondary bg-dark text-white"
      onClick={() => navigate("/")}
    >
      Back to Home
    </button>
  </div>

  {submitted ? (
    <div className="text-dark text-center">
      <p>Thanks for your message! We'll get back to you soon.</p>
    </div>
  ) : (
    <form
      action="https://formspree.io/f/xanjvkjq"
      method="POST"
      onSubmit={handleSubmit}
      className="size-contact-form"
    >
      <p className="text-dark">
        Let us know if you have any questions or feedback
      </p>
      <div className="mb-3">
        <label htmlFor="name" className="form-label text-dark">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          className="form-control"
          placeholder="Your name"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label text-dark">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          className="form-control"
          placeholder="Your email"
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="message" className="form-label text-dark">Message</label>
        <textarea
          id="message"
          name="message"
          className="form-control"
          rows={4}
          placeholder="Your message"
          required
        ></textarea>
      </div>

      <button type="submit" className="btn btn-dark w-100">Send</button>
    </form>
  )}
</div>

  );
};

export default Contact;
