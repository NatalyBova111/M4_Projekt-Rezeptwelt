import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Recipe } from '../../lib/types';
import RecipeCard from '../recipeCard/RecipeCard';

type Props = {
  categoryId?: string;     
  limit?: number;         
  order?: 'latest' | 'oldest';
};

export default function RecipeList({ categoryId, limit, order = 'latest' }: Props) {
  const [items, setItems] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let q = supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: order === 'oldest' });

      if (categoryId) q = q.eq('category_id', categoryId);
      if (limit) q = q.limit(limit);

      const { data, error } = await q;
      if (error) console.error(error);
      setItems(data || []);
      setLoading(false);
    };
    load();
  }, [categoryId, limit, order]);

  if (loading) return <p>Loading…</p>;
  if (!items.length) return <p>Keine Rezepte gefunden.</p>;

  return (
    <div className="grid grid-3">
      {items.map(r => <RecipeCard key={r.id} recipe={r} />)}
    </div>
  );
}
