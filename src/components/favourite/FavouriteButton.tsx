
import { useState } from "react";
import { useFavourites } from "../../hooks/useFavourites";
import "./Favourite.css";

type Props = { recipeId: string; size?: number };

export default function FavouriteButton({ recipeId, size = 28 }: Props) {
  const { has, toggle, isAuthed } = useFavourites();
  const [pending, setPending] = useState(false);

  const active = has(recipeId);
  const title = !isAuthed
    ? "Bitte einloggen, um zu speichern"
    : active
    ? "Aus Favoriten entfernen"
    : "Zu Favoriten";

  async function onClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed || pending) return;
    setPending(true);
    await toggle(recipeId);
    setPending(false);
  }

  return (
    <button
      className={`fav-btn ${active ? "active" : ""}`}
      onClick={onClick}
      title={title}
      disabled={!isAuthed || pending}
    >
      <img
        src={active ? "/img/heart.svg" : "/img/heart-outline.svg"}
        alt={active ? "Favorit" : "Nicht Favorit"}
      />
    </button>
  );
}
