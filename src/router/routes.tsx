// src/router/routes.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import Home from '../pages/home/Home';
import Rezepte from '../pages/rezepte/Rezepte';
import UeberUns from '../pages/ueberUns/UeberUns';
import Rezept from '../pages/rezept/Rezept';
import Login from '../pages/auth/Login';
import { useAuth } from '../context/AuthProvider';
import type { ReactNode } from 'react';
import AddRecipe from '../pages/rezept/AddRecipe';
import EditRecipe from '../pages/rezept/EditRecipe';
import Profil from '../pages/profil/Profil';

// --- простые guard-компоненты ---
function AuthOnly({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function GuestOnly({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : <>{children}</>;
}

// опциональная страница 404
function NotFound() {
  return <div className="container section"><h3>Seite nicht gefunden</h3></div>;
}

// --- роутер ---
export const router = createBrowserRouter([
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
      {
        path: 'rezept/:id/bearbeiten',
        element: <EditRecipe />,
      },
      { path: '/profil', element: <Profil /> },
    ],
  },
]);
