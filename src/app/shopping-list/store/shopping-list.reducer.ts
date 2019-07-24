import {Ingredient} from '../../shared/ingredient.model';
import * as SLActions from './shopping-list.actions';
import {AddIngredients, DeleteIngredient, StartEdit, UpdateIngredient} from './shopping-list.actions';

export interface AppState {
  shoppingList: ShoppingListState;
}

export interface ShoppingListState {
  ingredients: Ingredient[],
  editedIngredient: Ingredient,
  editedIngredientIndex: number;
}

const initialState: ShoppingListState = {
  ingredients: [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10)
  ],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

export function shoppingListReducer(state: ShoppingListState = initialState, action: SLActions.Actions) {
  switch (action.type) {

    case SLActions.ADD_INGREDIENT:
      const addAction = (action as AddIngredients);
      return {
        ...state,
        ingredients: [...state.ingredients, addAction.payload]
      };

    case SLActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...(action as AddIngredients).payload]
      };

    case SLActions.UPDATE_INGREDIENT:
      const updateAction = (action as UpdateIngredient);
      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updated = {...ingredient, ...updateAction.payload};
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updated;

      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredientIndex: -1,
        editedIngredient: null
      };

    case SLActions.DELETE_INGREDIENT:
      const deleteAction = (action as DeleteIngredient);
      return {
        ...state,
        ingredients: state.ingredients.filter((ig, index) => {return index != state.editedIngredientIndex}),
        editedIngredientIndex: -1,
        editedIngredient: null
      };

    case SLActions.START_EDIT:
      let startEditAction = action as StartEdit;
      return {
        ...state,
        editedIngredientIndex: startEditAction.payload,
        editedIngredient: {...state.ingredients[startEditAction.payload]}
      };
    case SLActions.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1
      };

    default:
      return initialState;
  }
}
