import { Outlet } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import './App.css'

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
