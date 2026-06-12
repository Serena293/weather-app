import { Link } from "react-router-dom";
import type { NavbarProps } from "../types";

const Navbar = ({ onUseGeolocation, isLocating }: NavbarProps) => {
  return (
    <nav className="navbar navbar-dark bg-dark" aria-label="Main navigation">
      <div className="container">
        <Link className="navbar-brand" to="/" aria-label="Weather home">
          <img src="/pwa-512x512.png" alt="" width={60} height={60} />
        </Link>

        <button
          type="button"
          className="nav-link text-white location-button"
          onClick={onUseGeolocation}
          disabled={isLocating}
        >
          {isLocating ? "Finding location..." : "Use my location"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
