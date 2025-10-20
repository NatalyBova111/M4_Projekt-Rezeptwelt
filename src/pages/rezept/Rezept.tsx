
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Ingredient, Recipe } from '../../lib/types';
import { useAuth } from '../../context/AuthProvider';
import './Rezept.css';
import fallbackImg from '../../assets/hero.jpg';

export default function Rezept() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [ings, setIngs] = useState<Ingredient[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();
      setRecipe(data as Recipe);

      const { data: ii } = await supabase
        .from('ingredients')
        .select('*')
        .eq('recipe_id', id)
        .order('name', { ascending: true });
      setIngs(ii || []);
    })();
  }, [id]);

  if (!recipe) return null;

  const hero = (recipe as any).image_url || fallbackImg;

  // "Zusätzliche Informationen"
  const [stepsPart, infoPart] = recipe.instructions
    ? recipe.instructions.split(/Zusätzliche Informationen:/i)
    : ['', ''];

  const steps = stepsPart
    .split(/\n?\s*\d+\.\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <article className="container section">
  
      <div className="recipe-actions" style={{ display: 'flex', gap: 12, margin: '12px 0' }}>
        <button className="back-btn" onClick={() => navigate(-1)}>← Zurück</button>

        {user && (recipe as any).owner_id === user.id && (
          <button
            className="back-btn"
            onClick={() => navigate(`/rezept/${recipe.id}/bearbeiten`)}
          >
            Rezept bearbeiten
          </button>
        )}
      </div>

      <div className="recipe-hero">
        <img src={hero} alt={recipe.name} />
        <h1>{recipe.name}</h1>
      </div>

      {ings.length > 0 && (
        <>
          <h3>Zutaten</h3>
          <ul>
            {ings.map(i => (
              <li key={i.id}>
                {i.quantity ?? ''} {i.unit ?? ''} {i.name}
                {i.additional_info ? ` — ${i.additional_info}` : ''}
              </li>
            ))}
          </ul>
        </>
      )}

      {steps.length > 0 && (
        <>
          <h3>Zubereitung</h3>
          <ol>
            {steps.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ol>
        </>
      )}

      {infoPart.trim() && (
        <>
          <h3>Zusätzliche Informationen</h3>
          <p>{infoPart.trim()}</p>
        </>
      )}
    </article>
  );
}
