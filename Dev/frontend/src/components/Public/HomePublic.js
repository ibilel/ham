import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PublicAcceuil from './pages';
import { NavLink } from 'react-router-dom';

function HomePublic() {

  return (
    <>
      {/* MENU */}
        <nav className="navbar primary_bg">
          <div className="container-fluid">
            <NavLink className="navbar-brand text-white" to={"/"}>Navbar</NavLink>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
             
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
