import { supabase } from './supabase';
import type { Recipe } from './types';

export type RecipeSearchParams = {
  q?: string;          // search query
  categoryId?: string; // optional category filter
  limit?: number;
  offset?: number;
};

export async function searchRecipes({
  q,
  categoryId,
  limit = 60,
  offset = 0,
}: RecipeSearchParams): Promise<{ data: Recipe[]; error: string | null }> {
  try {
    const like = q ? `%${q}%` : null;

    // --- A) Search by recipe name ---
    let nameIds: string[] = [];
    if (like) {
      const { data: nameList, error: nameListErr } = await supabase
        .from('recipes')
        .select('id')
        .ilike('name', like);
      if (nameListErr) throw nameListErr;
      nameIds = (nameList ?? []).map((r: any) => r.id);
    }

    // --- B) Search by ingredients (get recipe_id) ---
    let ingIds: string[] = [];
    if (like) {
      const { data: ingRows, error: ingErr } = await supabase
        .from('ingredients')
        .select('recipe_id')
        .ilike('name', like);
      if (ingErr) throw ingErr;
      ingIds = (ingRows ?? []).map((r: any) => r.recipe_id);
    }

    // --- Merge IDs from both sources ---
    let ids: string[] | null = null;
    if (like) {
      const set = new Set<string>([...nameIds, ...ingIds]);
      ids = Array.from(set);
      if (ids.length === 0) return { data: [], error: null };
    }

    // --- Final recipe query (apply category & pagination) ---
    let qRecipes = supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (ids) qRecipes = qRecipes.in('id', ids);
    if (categoryId) qRecipes = qRecipes.eq('category_id', categoryId);

    const { data, error } = await qRecipes;
    if (error) throw error;

    return { data: (data ?? []) as Recipe[], error: null };
  } catch (e: any) {
    // user-facing error message
    return { data: [], error: e?.message ?? 'Suche fehlgeschlagen' };
  }
}
