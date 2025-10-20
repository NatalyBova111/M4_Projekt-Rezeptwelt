
import { createBrowserRouter, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

import App from '../App';
import Home from '../pages/home/Home';
import Rezepte from '../pages/rezepte/Rezepte';
import UeberUns from '../pages/ueberUns/UeberUns';
import Rezept from '../pages/rezept/Rezept';
import AddRecipe from '../pages/rezept/AddRecipe';
import EditRecipe from '../pages/rezept/EditRecipe';
import Login from '../pages/auth/Login';
import Profil from '../pages/profil/Profil';
import { useAuth } from '../context/AuthProvider';

// Guards
function AuthOnly({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}
function GuestOnly({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : <>{children}</>;
}

// 404
function NotFound() {
  return (
    <div className="container section">
      <h3>Seite nicht gefunden</h3>
    </div>
  );
}

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'rezepte', element: <Rezepte /> },
      { path: 'rezept/:id', element: <Rezept /> },
      { path: 'ueber-uns', element: <UeberUns /> },
      { path: 'login', element: <GuestOnly><Login /></GuestOnly> },
      { path: 'rezept-hinzufuegen', element: <AddRecipe /> },
      { path: 'rezept/:id/bearbeiten', element: <EditRecipe /> },
      { path: 'profil', element: <Profil /> }, // <- без ведущего слэша
    ],
  },
];

//  GitHub Pages: basename = import.meta.env.BASE_URL
export const router = createBrowserRouter(routes, {
  basename: import.meta.env.BASE_URL,
});
