
import { createHashRouter, Navigate } from 'react-router-dom';
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

// Guards as components
function AuthOnly({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}
function GuestOnly({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : <>{children}</>;
}

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
    children: [
      { index: true, element: <Home /> },
      { path: 'rezepte', element: <Rezepte /> },
      { path: 'rezept/:id', element: <Rezept /> },
      { path: 'ueber-uns', element: <UeberUns /> },
      { path: 'login', element: <GuestOnly><Login /></GuestOnly> },
      { path: 'rezept-hinzufuegen', element: <AuthOnly><AddRecipe /></AuthOnly> },
      { path: 'rezept/:id/bearbeiten', element: <AuthOnly><EditRecipe /></AuthOnly> },
      { path: 'profil', element: <AuthOnly><Profil /></AuthOnly> },
      { path: '*', element: <NotFound /> },   
    ],
  },
];

export const router = createHashRouter(routes);
