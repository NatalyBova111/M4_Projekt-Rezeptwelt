// src/pages/rezepte/Rezepte.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Recipe } from '../../lib/types';

import Hero from '../../components/hero/Hero';
import SearchBar from '../../components/search/SearchBar';
import CategoryFilter from '../../components/categoryFilter/CategoryFilter';
import RecipeCard from '../../components/recipeCard/RecipeCard';
import RecipeRow from '../../components/recipeList/RecipeRow';
import { searchRecipes } from '../../lib/search';

import './Rezepte.css';

export default function Rezepte() {
  const [cat, setCat] = useState<string | undefined>(undefined);
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // загрузка данных (по категории и поисковому запросу)
  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);

      if (q.trim().length > 0) {
        // используем кастомный поиск
        const { data, error } = await searchRecipes({ q, categoryId: cat });
        if (error) setErr(error);
        setItems(data);
      } else {
        // стандартная загрузка без поиска
        let query = supabase
          .from('recipes')
          .select('*')
          .order('created_at', { ascending: false });

        if (cat) query = query.eq('category_id', cat);
        const { data, error } = await query;

        if (error) setErr(error.message);
        if (data) setItems(data as Recipe[]);
      }

      setLoading(false);
    })();
  }, [cat, q]);

  // разделяем на "топ-3" и остальные
  const featured = items.slice(0, 3);
  const latest = items.slice(3);

  return (
    <>
      <Hero />

      <section className="container page-heading">
        <h1>Rezepte</h1>
        <p>Finde Rezepte nach Name oder Zutat – oder stöbere in Kategorien.</p>
      </section>

      <section className="section">
        <div className="container">
          {/* Поиск + категории */}
          <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
            <SearchBar
              value={q}
              onChange={setQ}
              placeholder="Suche nach Name oder Zutat..."
            />
            <CategoryFilter value={cat} onChange={setCat} />
          </div>

          {err && <div className="add-recipe__alert add-recipe__alert--error">{err}</div>}
          {loading && <p>Suche…</p>}

          {/* Топ-3 карточки */}
          {featured.length > 0 && (
            <div className="grid grid-3" style={{ marginTop: 8, marginBottom: 28 }}>
              {featured.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>
          )}

          {/* Остальные — списком */}
          <h2 className="h1" style={{ marginTop: 8, marginBottom: 12 }}>Neueste Rezepte</h2>
          {!loading && latest.length === 0 && <p>Keine Rezepte gefunden.</p>}
          <div className="latest-list" style={{ display: 'grid', gap: '16px' }}>
            {latest.map((r) => (
              <RecipeRow key={r.id} recipe={r} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
