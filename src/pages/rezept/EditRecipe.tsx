
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthProvider';
import Hero from '../../components/hero/Hero';
import './AddRecipe.css';

type Category = { id: string; name: string };
type IngredientRow = {
  id: string;
  name: string;
  quantity?: string;
  unit?: string;
  additional_info?: string;
};

export default function EditRecipe() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState<number | ''>('');
  const [instructions, setInstructions] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [ingredients, setIngredients] = useState<IngredientRow[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: cats }, { data: rec, error: recErr }] = await Promise.all([
          supabase.from('categories').select('id,name').order('name'),
          supabase.from('recipes').select('*').eq('id', id!).single(),
        ]);
        setCategories(cats ?? []);
        if (recErr || !rec) throw recErr || new Error('Rezept nicht gefunden');

       
        if (user && rec.owner_id && user.id !== rec.owner_id) {
          setError('Du kannst nur deine eigenen Rezepte bearbeiten.');
          setLoading(false);
          return;
        }

       
        setName(rec.name ?? '');
        setDescription(rec.description ?? '');
        setServings(rec.servings ?? '');
        setInstructions(rec.instructions ?? '');
        setCategoryId(rec.category_id ?? '');
        setImageUrl(rec.image_url ?? null);

   
        const { data: ings } = await supabase
          .from('ingredients')
          .select('id,name,quantity,unit,additional_info')
          .eq('recipe_id', id!);

        const rows =
          (ings ?? []).map(r => ({
            id: r.id,
            name: r.name ?? '',
            quantity: r.quantity?.toString() ?? '',
            unit: r.unit ?? '',
            additional_info: r.additional_info ?? '',
          })) || [];

        setIngredients(rows.length ? rows : [{ id: crypto.randomUUID(), name: '' }]);
      } catch (e: any) {
        setError(e?.message ?? 'Fehler beim Laden');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user]);

  const canSubmit = useMemo(
    () => !!name.trim() && !!categoryId && !!instructions.trim() && !!servings,
    [name, categoryId, instructions, servings]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user) {
      setError('Bitte logge dich ein, um das Rezept zu speichern.');
      return;
    }
    if (!canSubmit) {
      setError('Bitte fülle die Pflichtfelder aus.');
      return;
    }

    setSaving(true);
    try {
      // 1) 
      let finalImageUrl = imageUrl;
      if (imageFile) {
        const path = `${user.id}/${crypto.randomUUID()}-${imageFile.name}`;
        const { error: upErr } = await supabase.storage
          .from('recipe-images')
          .upload(path, imageFile, { upsert: false });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('recipe-images').getPublicUrl(path);
        finalImageUrl = data.publicUrl ?? null;
      }

      // 2) 
      const { error: updErr } = await supabase
        .from('recipes')
        .update({
          name: name.trim(),
          description: description.trim() || null,
          servings: Number(servings),
          instructions: instructions.trim(),
          category_id: categoryId,
          image_url: finalImageUrl,
        })
        .eq('id', id!);
      if (updErr) throw updErr;

      // 3) 
      await supabase.from('ingredients').delete().eq('recipe_id', id!);

      const rows = ingredients
        .map(r => ({
          id: crypto.randomUUID(),
          recipe_id: id!,
          name: r.name.trim(),
          quantity: r.quantity ? Number(r.quantity) : null,
          unit: r.unit?.trim() || null,
          additional_info: r.additional_info?.trim() || null,
        }))
        .filter(r => r.name.length > 0);

      if (rows.length) {
        const { error: ingErr } = await supabase.from('ingredients').insert(rows);
        if (ingErr) throw ingErr;
      }

      setSuccess('Änderungen gespeichert.');
      navigate(`/rezept/${id}`, { replace: true });
    } catch (e: any) {
      setError(e?.message ?? 'Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  }

  function updateIngredient(rowId: string, patch: Partial<IngredientRow>) {
    setIngredients(prev => prev.map(r => (r.id === rowId ? { ...r, ...patch } : r)));
  }
  function addIngredient() {
    setIngredients(prev => [...prev, { id: crypto.randomUUID(), name: '' }]);
  }
  function removeIngredient(rowId: string) {
    setIngredients(prev => (prev.length > 1 ? prev.filter(r => r.id !== rowId) : prev));
  }

  if (loading) return null;

  return (
    <>
      <Hero />


<section className="container page-heading">
  <h1>Rezept bearbeiten</h1>
  <p>Passe dein Rezept an und speichere die Änderungen.</p>
</section>


      <section className="container section add-recipe add-recipe-page">
        {error && (
          <div className="add-recipe__alert add-recipe__alert--error">{error}</div>
        )}
        {success && (
          <div className="add-recipe__alert add-recipe__alert--ok">{success}</div>
        )}

        <form className="add-recipe__form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-control">
              <label>Name des Rezepts *</label>
              <input value={name} onChange={e => setName(e.target.value)} required />
            </div>

            <div className="form-control">
              <label>Kategorie *</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                required
              >
                <option value="">— Kategorie wählen —</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label>Portionen *</label>
              <input
                type="number"
                min={1}
                value={servings}
                onChange={e =>
                  setServings(e.target.value ? Number(e.target.value) : '')
                }
              />
            </div>

            <div className="form-control form-control--full">
              <label>Kurze Beschreibung</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>

            <div className="form-control form-control--full">
              <label>Zubereitung *</label>
              <textarea
                rows={8}
                required
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
              />
            </div>

            <div className="form-control form-control--full">
              <label>Bild (optional)</label>
              {imageUrl && (
                <small className="muted" style={{ display: 'block', marginBottom: 6 }}>
                  Aktuelles Bild ist gesetzt.
                </small>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={e => setImageFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <fieldset className="ingredients">
            <legend>Zutaten</legend>
            <div className="ingredients__rows">
              {ingredients.map(row => (
                <div key={row.id} className="ingredients__row">
                  <input
                    className="grow"
                    placeholder="Zutat"
                    value={row.name}
                    onChange={e => updateIngredient(row.id, { name: e.target.value })}
                  />

                  <input
                    className="num"
                    placeholder="Menge"
                    inputMode="decimal"
                    value={row.quantity ?? ''}
                    onChange={e =>
                      updateIngredient(row.id, { quantity: e.target.value })
                    }
                  />

                  {/*  SELECT */}
                  <select
                    className="unit"
                    value={row.unit ?? ''}
                    onChange={e => updateIngredient(row.id, { unit: e.target.value })}
                  >
                    <option value="">Einheit wählen</option>
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="TL">TL</option>
                    <option value="EL">EL</option>
                    <option value="Stk">Stk</option>
                    <option value="Prise">Prise</option>
                  </select>

                  <input
                    className="info"
                    placeholder="Zusatzinfo"
                    value={row.additional_info ?? ''}
                    onChange={e =>
                      updateIngredient(row.id, { additional_info: e.target.value })
                    }
                  />

                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => removeIngredient(row.id)}
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
          <button className="btn btn-primary" disabled={saving || !canSubmit}>
            {saving ? 'Speichern…' : 'Änderungen speichern'}
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => navigate(`/rezept/${id}`)}
          >
            Abbrechen
          </button>
        </div>
        </form>
      </section>
    </>
  );
}
