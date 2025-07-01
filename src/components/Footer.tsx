import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <p className="mb-2 mb-md-0">
          © {new Date().getFullYear()} Weather's App. All rights reserved.
        </p>
        <div>
          <Link to="/about" className="text-white text-decoration-none me-3">About</Link>
          <Link to="/contact" className="text-white text-decoration-none me-3">Contact</Link>
          <a href="/privacy" className="text-white text-decoration-none">Privacy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
