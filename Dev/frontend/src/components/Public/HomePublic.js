import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import PublicAcceuil from './pages';

function HomePublic() {

  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  function toggleDarkMode() {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  }

  return (
    <>
      {/* MENU */}
        <nav className="navbar primary_bg">
          <div className="container-fluid">
            <a className="navbar-brand text-white" href="#">Navbar</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Features</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">Pricing</a>
                </li>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Dropdown link
                  </a>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Action</a></li>
                    <li><a className="dropdown-item" href="#">Another action</a></li>
                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      <div className="content-custom">
        <Routes>
          <Route index element={<PublicAcceuil />} />
        </Routes>
      </div>

    </>
  );
}

export default HomePublic;
