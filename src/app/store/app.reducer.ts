import {ActionReducerMap} from '@ngrx/store';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import {recipeReducer, RecipeState} from '../recipes/store/recipe.reducer';

export interface AppState {
  shoppingList: fromShoppingList.ShoppingListState;
  auth: fromAuth.AuthState;
  recipes: RecipeState;
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer,
  recipes: recipeReducer,
};
