import {Recipe} from '../recipe.model';
import {ADD_RECIPE, DELETE_RECIPE, RecipeActions, SET_RECIPES, UPDATE_RECIPE} from './recipe.actions';

export interface RecipeState {
  recipes: Recipe[];
}

const initialState: RecipeState = {
  recipes: []
};

export function recipeReducer(
  state: RecipeState = initialState,
  action: RecipeActions) {

  switch (action.type) {
    case SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload],
      };

    case ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload]
      };

    case UPDATE_RECIPE:
      const updatedRecipe = {
        ...state.recipes[action.payload.index],
        ...action.payload.newRecipe
      };

      const recipesList = [...state.recipes];
      recipesList[action.payload.index] = updatedRecipe;

      return {
        ...state,
        recipes: recipesList,
      };

    case DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, index) => {
          return index !== action.payload;
        })
      };

    default:
      return state;
  }
}
