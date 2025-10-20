

import { Link } from 'react-router-dom';
import type { Recipe } from '../../lib/types';
import FavouriteButton from '../favourite/FavouriteButton';
import './RecipeRow.css';

type Props = {
  recipe: Recipe;
  showFav?: boolean; 
};

export default function RecipeRow({ recipe, showFav = true }: Props) {
  const img = (recipe as any).image_url || '/src/assets/hero.jpg';

  return (
    <article className="recipe-row card">
      <div className="recipe-row__media">
        <img className="recipe-row__img" src={img} alt={recipe.name} />
        {showFav && (
          <div className="recipe-row__fav">
            <FavouriteButton recipeId={recipe.id} />
          </div>
        )}
      </div>

      <div className="recipe-row__body">
        <h3 className="recipe-row__title">{recipe.name}</h3>
        {recipe.description && (
          <p className="recipe-row__teaser">{recipe.description}</p>
        )}
        <Link className="btn recipe-row__btn" to={`/rezept/${recipe.id}`}>
          Zum Rezept
        </Link>
      </div>
    </article>
  );
}
