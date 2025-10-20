import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Hero from '../../components/hero/Hero';
import './Login.css';

export default function Login() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  // nur signup
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const nav = useNavigate();

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  // === LOGIN ===
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      nav('/profil', { replace: true });
    } catch (e: any) {
      setError(e?.message ?? 'Login fehlgeschlagen');
    } finally {
      setSaving(false);
    }
  }

  // === SIGNUP ===
  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      const uid = data.user?.id;
      let avatar_path: string | null = null;

      if (uid && avatarFile) {
        const path = `${uid}/${crypto.randomUUID()}-${avatarFile.name}`;
        const { error: upErr } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: false });
        if (upErr) throw upErr;
        avatar_path = path; // bucket path speichern
      }

      if (uid) {
        await supabase.from('customers').upsert(
          {
            id: uid,
            email,
            username: username.trim() || email.split('@')[0],
            firstname: firstname.trim() || null,
            lastname: lastname.trim() || null,
            avatar_url: avatar_path,
          },
          { onConflict: 'id' }
        );
      }

      nav('/profil', { replace: true });
    } catch (e: any) {
      setError(e?.message ?? 'Registrierung fehlgeschlagen');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Hero />

      <section className="page-heading container">
        <h1>{mode === 'login' ? 'Login' : 'Sign up'}</h1>
      </section>

      <section className="container section auth">
        {error && <div className="auth__alert auth__alert--error">{error}</div>}

        <form
          className="card auth__form"
          onSubmit={mode === 'login' ? handleLogin : handleSignup}
        >
          <div className="form-grid">

            {mode === 'signup' && (
              <div className="form-control form-control--full auth__avatar">
                <div className="auth__avatar-box">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar preview" />
                  ) : (
                    <span className="auth__avatar-empty">Kein Bild</span>
                  )}
                </div>

                <input
                  id="avatarFile"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setAvatarFile(f);
                    setAvatarPreview(f ? URL.createObjectURL(f) : null);
                  }}
                />

                <button
                  type="button"
                  className="btn-upload"
                  onClick={() => document.getElementById('avatarFile')?.click()}
                >
                  Upload Photo
                </button>
              </div>
            )}

            <div className="form-control form-control--full">
              <label>E-Mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="dein@email.de"
              />
            </div>

            <div className="form-control form-control--full">
              <label>Passwort</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {mode === 'signup' && (
              <>
                <div className="form-control">
                  <label>Username</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="z. B. maxmuster"
                  />
                </div>
                <div className="form-control">
                  <label>Vorname</label>
                  <input
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    placeholder="Max"
                  />
                </div>
                <div className="form-control">
                  <label>Nachname</label>
                  <input
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    placeholder="Mustermann"
                  />
                </div>
              </>
            )}
          </div>

          <div className="actions">
            <button className="btn btn-primary" disabled={saving}>
              {saving
                ? mode === 'login'
                  ? 'Einloggen…'
                  : 'Registrieren…'
                : mode === 'login'
                ? 'Einloggen'
                : 'Registrieren'}
            </button>
          </div>

          <div className="auth__switch">
            {mode === 'login' ? (
              <button type="button" className="linklike" onClick={() => setMode('signup')}>
                Noch kein Konto? Registrieren
              </button>
            ) : (
              <button type="button" className="linklike" onClick={() => setMode('login')}>
                Schon registriert? Einloggen
              </button>
            )}
          </div>
        </form>
      </section>
    </>
  );
}
