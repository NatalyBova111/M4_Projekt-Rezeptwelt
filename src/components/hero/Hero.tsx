
import './Hero.css';
import heroImg from '../../assets/hero.jpg';

export default function Hero() {
  return (
    <section className="hero" style={{ backgroundImage: `url(${heroImg})` }}>
      <div className="hero__overlay" />
      <div className="container hero__content">
        <h1>
          Lassen Sie sich inspirieren, kochen Sie mit Leidenschaft
          und erleben Sie unvergessliche Momente bei Tisch.
        </h1>
      </div>
    </section>
  );
}
