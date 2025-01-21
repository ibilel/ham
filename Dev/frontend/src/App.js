
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePublic from './components/Public/HomePublic';
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";

function App() {

  return (
    <Routes>
      {/* Route pour la page d'accueil publique */}
      <Route path="/" element={<HomePublic />} />
      
      {/* Redirection vers la page d'accueil si la route n'existe pas */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
