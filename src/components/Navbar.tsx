import type { NavbarProps } from "../types";

const Navbar = ({ onUseGeolocation }: NavbarProps) => {
  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container">
        <a className="navbar-brand" href="/">
          <img src="/pwa-512x512.png" alt="App logo" width={60} height={60} />
        </a>
             
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onUseGeolocation();
                }}
              >
                📍 Use my location
              </a>
            </li>
          </ul>
        </div>

    </nav>
  );
};

export default Navbar;
