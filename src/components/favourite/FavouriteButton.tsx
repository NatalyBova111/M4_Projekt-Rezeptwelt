import { useState } from 'react';
import { useFavourites } from '../../hooks/useFavourites';
import './Favourite.css'; 

type Props = { recipeId: string; size?: number };

export default function FavouriteButton({ recipeId, size = 28 }: Props) {
  const { has, toggle, isAuthed } = useFavourites();
  const [pending, setPending] = useState(false);

  const active = has(recipeId);
  const title = !isAuthed
    ? 'Bitte einloggen, um zu speichern'
    : active
    ? 'Aus Favoriten entfernen'
    : 'Zu Favoriten';

  async function onClick(e: React.MouseEvent) {
    e.preventDefault();
    if (!isAuthed || pending) return;
    setPending(true);
    await toggle(recipeId);
    setPending(false);
  }

  return (
    <button
      className={`fav-btn ${active ? 'is-active' : ''}`}
      onClick={onClick}
      title={title}
      aria-label={title}
      disabled={!isAuthed || pending}
      style={{ width: size, height: size }}
      type="button"
    >

<svg className="fav-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
  <path
    /* Material Icons – favorite */
    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
       2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.13 2.44C11.09 5.01 12.76 4 14.5 4
       17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
    fill="currentColor"
  />
</svg>




    </button>
  );
}
