import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Hero from '../../components/hero/Hero';
import SearchBar from '../../components/search/SearchBar';
import CategoryFilter from '../../components/categoryFilter/CategoryFilter';
import RecipeList from '../../components/recipeList/RecipeList';

export default function Home() {
  const [cat, setCat] = useState<string | undefined>(undefined);
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  return (
    <>
      <Hero />

  
      <section className="container page-heading">
        <h1 className="h1">Die beliebtesten Rezepte</h1>
        <p>Finde Inspiration und entdecke neue Lieblingsrezepte.</p>
      </section>

      <section className="section">
        <div className="container" style={{ display: 'grid', gap: 16 }}>
    
          <SearchBar
            value={q}
            onChange={setQ}
            onSubmit={(term) => navigate(`/rezepte?q=${encodeURIComponent(term)}`)}
            placeholder="Suche nach Name oder Zutat…"
          />

        
          <CategoryFilter
            value={cat}
            onChange={setCat}
            onAllClick={() => navigate('/rezepte')}
          />

          
          <RecipeList order="latest" limit={3} categoryId={cat} />
        </div>
      </section>
    </>
  );
}
