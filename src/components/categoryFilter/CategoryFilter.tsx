
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Category } from '../../lib/types';
import './CategoryFilter.css';

type Props = {
  value?: string;
  onChange: (id: string | undefined) => void;
  onAllClick?: () => void;            
};

export default function CategoryFilter({ value, onChange, onAllClick }: Props) {
  const [cats, setCats] = useState<Category[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      if (error) console.error(error);
      setCats(data || []);
    })();
  }, []);

  const handleAll = () => {
    if (onAllClick) onAllClick();   
    else onChange(undefined);         
  };

  return (
    <div className="cat-filter">
      <button className={!value ? 'active' : ''} onClick={handleAll}>Alle</button>
      {cats.map(c => (
        <button
          key={c.id}
          className={value === c.id ? 'active' : ''}
          onClick={() => onChange(c.id)}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
