import { Link } from 'react-router-dom';
import type { Recipe } from '../../lib/types';
import './RecipeCard.css';
import fallbackImg from '../../assets/hero.jpg';
import FavouriteButton from '../favourite/FavouriteButton';

type Props = { recipe: Recipe };

export default function RecipeCard({ recipe }: Props) {
  const img = (recipe as any).image_url || fallbackImg;

  return (
    <article className="card recipe-card">

      <div className="recipe-card__media">
        <img className="recipe-card__img" src={img} alt={recipe.name} />
        <FavouriteButton recipeId={recipe.id} size={36} />
      </div>

      <div className="recipe-card__content">
        <div className="recipe-card__text">
          <h3 className="recipe-card__title">{recipe.name}</h3>
          {recipe.description && (
            <p className="recipe-card__desc teaser">{recipe.description}</p>
          )}
        </div>

        <div className="recipe-card__actions">
          <Link className="btn" to={`/rezept/${recipe.id}`} aria-label={`${recipe.name} – zum Rezept`}>
            Zum Rezept
          </Link>
        </div>
      </div>
    </article>
  );
}
