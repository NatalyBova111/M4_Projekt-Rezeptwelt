import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthProvider';

type FavouriteRow = { recipe_id: string };

export function useFavourites() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [ids, setIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) { setIds(new Set()); return; }
      setLoading(true);

      const { data, error } = await supabase
        .from('favourites')
        .select('recipe_id')
        .eq('user_id', user.id);

      if (!cancelled) {
        if (!error) {
          const list = (data as FavouriteRow[] | null) ?? [];
          setIds(new Set(list.map(r => r.recipe_id)));
        }
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const has = useCallback((recipeId: string) => ids.has(recipeId), [ids]);

  const toggle = useCallback(async (recipeId: string) => {
    if (!user) return { ok: false as const, reason: 'no-user' as const };

    if (ids.has(recipeId)) {
      const { error } = await supabase
        .from('favourites')
        .delete()
        .eq('user_id', user.id)
        .eq('recipe_id', recipeId);
      if (!error) setIds(prev => { const s = new Set(prev); s.delete(recipeId); return s; });
      return { ok: !error };
    } else {
      const { error } = await supabase
        .from('favourites')
        .insert({ user_id: user.id, recipe_id: recipeId });
      if (!error) setIds(prev => { const s = new Set(prev); s.add(recipeId); return s; });
      return { ok: !error };
    }
  }, [user, ids]);

  return { loading, ids, has, toggle, isAuthed: !!user };
}
