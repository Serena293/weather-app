import { Link } from "react-router-dom";

const NotFound = () => (
  <main className="min-vh-100 bg-secondary d-flex align-items-center">
    <div className="container text-center text-dark">
      <p className="display-1 fw-bold mb-2">404</p>
      <h1 className="h2">Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link to="/" className="btn btn-dark">
        Back to Home
      </Link>
    </div>
  </main>
);

export default NotFound;
