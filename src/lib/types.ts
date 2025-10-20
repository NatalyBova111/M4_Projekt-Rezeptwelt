export type Category = {
  id: string;
  name: string;
  created_at: string;
};

export type Recipe = {
  id: string;
  name: string;
  description: string | null;
  servings: number | null;
  instructions: string | null;
  category_id: string;
  created_at: string;
  image_url?: string | null;
};

export type Ingredient = {
  id: string;
  recipe_id: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  additional_info: string | null;
  created_at: string;
};

export type Customer = {
  id: string;
  email: string | null;
  username: string | null;
  firstname: string | null;
  lastname: string | null;
  avatar_url?: string | null;   
};

export type Favourite = {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
};
