import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthProvider';
import Hero from '../../components/hero/Hero';
import './AddRecipe.css';

type Category = { id: string; name: string };
type IngredientRow = { id: string; name: string; quantity?: string; unit?: string; additional_info?: string };

export default function AddRecipe() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string| null>(null);
  const [success, setSuccess] = useState<string| null>(null);

  // form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState<number | ''>('');
  const [instructions, setInstructions] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [ingredients, setIngredients] = useState<IngredientRow[]>([
    { id: crypto.randomUUID(), name: '' },
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('categories')
        .select('id, name')
        .order('name', { ascending: true });
      setCategories(data ?? []);
    })();
  }, []);

  const canSubmit = useMemo(() => {
    return !!name.trim() && !!categoryId && !!instructions.trim() && !!servings;
  }, [name, categoryId, instructions, servings]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!canSubmit) {
      setError('Bitte fülle die Pflichtfelder aus.');
      return;
    }
    if (!user) {
      setError('Nur angemeldete Benutzer können Rezepte speichern. Bitte logge dich ein.');
      return;
    }

    setLoading(true);
    try {
      // 1) optional: Upload Bild
      let image_url: string | null = null;
      if (imageFile) {
        const path = `${user.id}/${crypto.randomUUID()}-${imageFile.name}`;
        const { error: upErr } = await supabase.storage.from('recipe-images').upload(path, imageFile, { upsert: false });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('recipe-images').getPublicUrl(path);
        image_url = data.publicUrl ?? null;
      }

      // 2) Insert Rezept
      const insertRecipe = {
        id: crypto.randomUUID(),
        name: name.trim(),
        description: description.trim() || null,
        servings: Number(servings),
        instructions: instructions.trim(),
        category_id: categoryId,
        image_url,
      };
      const { data: inserted, error: insErr } = await supabase
        .from('recipes')
        .insert(insertRecipe)
        .select('id')
        .single();
      if (insErr) throw insErr;
      const recipeId = inserted!.id as string;

      // 3) Insert Zutaten 
      const rows = ingredients
        .map(r => ({
          id: crypto.randomUUID(),
          recipe_id: recipeId,
          name: r.name.trim(),
          quantity: r.quantity ? Number(r.quantity) : null,
          unit: r.unit?.trim() || null,
          additional_info: r.additional_info?.trim() || null,
        }))
        .filter(r => r.name.length > 0);

      if (rows.length > 0) {
        const { error: ingErr } = await supabase.from('ingredients').insert(rows);
        if (ingErr) throw ingErr;
      }

      setSuccess('Rezept wurde gespeichert!');
      navigate(`/rezept/${recipeId}`, { replace: true });
    } catch (e: any) {
      setError(e?.message ?? 'Fehler beim Speichern');
    } finally {
      setLoading(false);
    }
  }

  function updateIngredient(id: string, patch: Partial<IngredientRow>) {
    setIngredients(prev => prev.map(r => (r.id === id ? { ...r, ...patch } : r)));
  }
  function addIngredient() {
    setIngredients(prev => [...prev, { id: crypto.randomUUID(), name: '' }]);
  }
  function removeIngredient(id: string) {
    setIngredients(prev => prev.length > 1 ? prev.filter(r => r.id !== id) : prev);
  }

  return (
    <>
      <Hero />
      <section className="container page-heading">
        <h1>Neues Rezept</h1>
        <p>Teile deine kulinarische Idee mit der Community und füge ein neues Rezept hinzu.</p>
      </section>

      <section className="container section add-recipe">
        {!user && (
          <p className="add-recipe__hint">
            Hinweis: Diese Seite ist öffentlich sichtbar, aber <strong>Speichern</strong> ist nur nach Login möglich.
          </p>
        )}

        {error && <div className="add-recipe__alert add-recipe__alert--error">{error}</div>}
        {success && <div className="add-recipe__alert add-recipe__alert--ok">{success}</div>}

        <form className="add-recipe__form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-control">
              <label>Name des Rezepts *</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Z. B. Vanille-Waffeln"
                required
              />
            </div>

            <div className="form-control">
              <label>Kategorie *</label>
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                <option value="">— Kategorie wählen —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label>Portionen *</label>
              <input
                type="number"
                min={1}
                value={servings}
                onChange={e => setServings(e.target.value ? Number(e.target.value) : '')}
              />
            </div>

            <div className="form-control form-control--full">
              <label>Kurze Beschreibung</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Kurzer Teaser-Text..."
              />
            </div>

            <div className="form-control form-control--full">
              <label>Zubereitung *</label>
              <textarea
                rows={8}
                required
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder={`1. Schritt eins...\n2. Schritt zwei...\n3. Schritt drei...`}
              />
              <small className="muted">Tipp: Jeder Schritt mit neuer Zeile (1., 2., 3. …).</small>
            </div>

            <div className="form-control form-control--full">
              <label>Bild (optional)</label>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <button
                type="button"
                className="btn-upload"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                Upload Photo
              </button>

              {!user && imageFile && (
                <small className="muted">Für den Bild-Upload ist ein Login erforderlich.</small>
              )}
            </div>
          </div>

          <fieldset className="ingredients">
            <legend>Zutaten (optional)</legend>
            <div className="ingredients__rows">
              {ingredients.map((row) => (
                <div key={row.id} className="ingredients__row">
                  <input
                    className="grow"
                    placeholder="Zutat (Name)"
                    value={row.name}
                    onChange={e => updateIngredient(row.id, { name: e.target.value })}
                  />
                  <input
                    className="num"
                    placeholder="Menge"
                    inputMode="decimal"
                    value={row.quantity ?? ''}
                    onChange={e => updateIngredient(row.id, { quantity: e.target.value })}
                  />
                  <input
                    className="unit"
                    placeholder="Einheit (g, ml, EL…) "
                    value={row.unit ?? ''}
                    onChange={e => updateIngredient(row.id, { unit: e.target.value })}
                  />
                  <input
                    className="info"
                    placeholder="Zusatzinfo (optional)"
                    value={row.additional_info ?? ''}
                    onChange={e => updateIngredient(row.id, { additional_info: e.target.value })}
                  />
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => removeIngredient(row.id)}
                    title="Zutat entfernen"
                    aria-label="Zutat entfernen"
                    disabled={ingredients.length === 1}
                  >
                    –
                  </button>
                </div>
              ))}
            </div>
            <div className="ingredients__actions">
              <button type="button" className="btn" onClick={addIngredient}>
                + Zutat hinzufügen
              </button>
            </div>
          </fieldset>

          <div className="actions">
            <button className="btn btn-primary" disabled={loading || !canSubmit}>
              {loading ? 'Speichern…' : 'Rezept speichern'}
            </button>
            <button type="button" className="btn" onClick={() => navigate(-1)}>
              Abbrechen
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
