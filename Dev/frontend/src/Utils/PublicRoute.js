import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from './Common';
//import FileUpload from '../file/FileUpload.js'; // Importez votre composant pour le téléchargement de fichiers

// handle the public routes
function PublicRoute({ component: Component, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => !getToken() ? <Component {...props} /> : <Redirect to={{ pathname: '/' }} />}
    />
  )
}

/*
// Ajoutez une route pour le téléchargement de fichiers
function FileRoute() {
  return (
    <Route
      path="/upload"
      component={FileUpload}
    />
  );
}

*/

export { PublicRoute };
