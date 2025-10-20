
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthProvider';
import type { Customer, Recipe } from '../../lib/types';
import Hero from '../../components/hero/Hero';
import RecipeRow from '../../components/recipeList/RecipeRow';
import RecipeCard from '../../components/recipeCard/RecipeCard';
import './Profil.css';

export default function Profil() {
  const { user } = useAuth();
  const nav = useNavigate();

  const [me, setMe] = useState<Customer | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favs, setFavs] = useState<Recipe[]>([]);      

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  
  useEffect(() => {
    if (user === null) nav('/login', { replace: true });
  }, [user, nav]);


  useEffect(() => {
    if (!user) return;

    (async () => {
      setErr(null);

    
      const { data: c, error: ce } = await supabase
        .from('customers')
        .select('*')
        .eq('id', user.id)
        .single();

      if (ce) { setErr(ce.message); return; }

      if (!c) {
        const { error } = await supabase
          .from('customers')
          .upsert({ id: user.id, email: user.email }, { onConflict: 'id' });
        if (error) { setErr(error.message); return; }
      }

      const profile = c ?? (await supabase
        .from('customers')
        .select('*')
        .eq('id', user.id)
        .single()).data;

      setMe(profile as Customer);
      setUsername(profile?.username ?? '');
      setFirstname(profile?.firstname ?? '');
      setLastname(profile?.lastname ?? '');

  
      const { data: rs } = await supabase
        .from('recipes')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });
      setRecipes((rs ?? []) as Recipe[]);

      // favourites (join по FK favourites.recipe_id -> recipes.id)
      const { data: favRows } = await supabase
        .from('favourites')
        .select('recipes(*)')
        .eq('user_id', user.id);

      setFavs((favRows ?? []).map((r: any) => r.recipes as Recipe));
    })();
  }, [user]);

  
  function normalizeAvatarPath(value: string): string {
    if (!value) return value;
    if (value.startsWith('http')) {
      const i = value.indexOf('/avatars/');
      if (i !== -1) return value.slice(i + '/avatars/'.length);
    }
    return value;
  }

  // signed URL (avatars)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const raw = me?.avatar_url || '';
      if (!raw) { if (!cancelled) setAvatarSrc(null); return; }
      const path = normalizeAvatarPath(raw);
      const { data, error } = await supabase
        .storage
        .from('avatars')
        .createSignedUrl(path, 60 * 60 * 24 * 7);
      if (!cancelled) setAvatarSrc(error ? null : (data?.signedUrl ?? null));
    })();
    return () => { cancelled = true; };
  }, [me?.avatar_url]);

  const canSave = useMemo(
    () => !!user && (username.trim().length > 0 || firstname || lastname),
    [user, username, firstname, lastname]
  );

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setErr(null);
    setOk(null);

    try {
      const { data, error } = await supabase
        .from('customers')
        .update({
          username: username.trim() || null,
          firstname: firstname.trim() || null,
          lastname: lastname.trim() || null,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setMe(data as Customer);
      setOk('Profil gespeichert.');
    } catch (e: any) {
      setErr(e?.message ?? 'Fehler');
    } finally {
      setSaving(false);
    }
  }


  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoUploading(true);
    setErr(null);
    setOk(null);

    try {
      const path = `${user.id}/${crypto.randomUUID()}-${file.name}`;
      const { error: upErr } = await supabase
        .storage
        .from('avatars')
        .upload(path, file, { upsert: false });
      if (upErr) throw upErr;

      const { data, error: updErr } = await supabase
        .from('customers')
        .update({ avatar_url: path })
        .eq('id', user.id)
        .select()
        .single();
      if (updErr) throw updErr;

      const { data: signed } = await supabase
        .storage
        .from('avatars')
        .createSignedUrl(path, 60 * 60 * 24 * 7);

      setMe(data as Customer);
      setAvatarSrc(signed?.signedUrl ?? null);
      setOk('Foto aktualisiert.');
    } catch (e: any) {
      setErr(e?.message ?? 'Foto konnte nicht aktualisiert werden.');
    } finally {
      setPhotoUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  if (!user) return null;

  return (
    <>
      <Hero />
      <section className="page-heading container">
        <h1>Mein Profil</h1>
        <p>Verwalte deine Daten und Rezepte.</p>
      </section>

      <section className="container section profil">
        {err && <div className="alert alert--error">{err}</div>}
        {ok && <div className="alert alert--ok">{ok}</div>}

        <div className="profil__layout">
          
          <div className="profil__avatar-col">
            <div className="profil__avatar-box">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Avatar" />
              ) : (
                <span className="profil__avatar-empty">Kein Bild</span>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />

            <button
              type="button"
              className="btn-upload"
              onClick={() => fileInputRef.current?.click()}
              disabled={photoUploading}
            >
              {photoUploading ? 'Wird hochgeladen…' : 'Foto ändern'}
            </button>
          </div>

          
          <form className="card profil__form" onSubmit={onSave}>
            <div className="profil__grid">
              <div className="form-control">
                <label>E-Mail</label>
                <input value={me?.email ?? user.email ?? ''} disabled />
              </div>
              <div className="form-control">
                <label>Username</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className="form-control">
                <label>Vorname</label>
                <input value={firstname} onChange={(e) => setFirstname(e.target.value)} />
              </div>
              <div className="form-control">
                <label>Nachname</label>
                <input value={lastname} onChange={(e) => setLastname(e.target.value)} />
              </div>
            </div>

            <div className="actions">
              <button className="btn btn-primary" disabled={!canSave || saving}>
                {saving ? 'Speichern…' : 'Speichern'}
              </button>
            </div>
          </form>
        </div>

      
        <h2 className="h1" style={{ marginTop: 28 }}>Meine Favoriten</h2>
        {favs.length === 0 && <p>Noch keine Favoriten.</p>}
        <div
          className="latest-list"
          style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))' }}
        >
          {favs.map(r => <RecipeCard key={r.id} recipe={r} />)}
        </div>

      
        <h2 className="h1" style={{ marginTop: 28 }}>Meine Rezepte</h2>
        {recipes.length === 0 && <p>Noch keine Rezepte.</p>}
        <div className="latest-list" style={{ display: 'grid', gap: 16 }}>
          {recipes.map(r => (
            <RecipeRow key={r.id} recipe={r} showFav={false} />
          ))}
        </div>
      </section>
    </>
  );
}
