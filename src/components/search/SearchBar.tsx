import { useState, useEffect } from 'react';
import './SearchBar.css';

type Props = {
  value?: string;
  placeholder?: string;
  onChange: (q: string) => void;   
  onSubmit?: (q: string) => void;  
  debounce?: number;               
};

export default function SearchBar({
  value = '',
  placeholder = 'Suche nach Name oder Zutat…',
  onChange,
  onSubmit,
  debounce = 300,
}: Props) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    const t = setTimeout(() => onChange(local.trim()), debounce);
    return () => clearTimeout(t);
  }, [local, debounce, onChange]);

  return (
    <form
      className="searchbar"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(local.trim());
      }}
    >
      <input
        className="searchbar__input"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
      />
      {local && (
        <button
          type="button"
          className="searchbar__clear"
          aria-label="Eingabe löschen"
          onClick={() => setLocal('')}
        >
          ×
        </button>
      )}
      <button type="submit" className="btn searchbar__btn">Suchen</button>
    </form>
  );
}
