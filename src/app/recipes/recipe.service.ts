import {Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import {Recipe} from './recipe.model';
import {Injectable} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';
import {AddIngredients} from '../shopping-list/store/shopping-list.actions';
import {AppState} from '../shopping-list/store/shopping-list.reducer';

@Injectable()
export class RecipeService {

  constructor(private shopListService: ShoppingListService,
              private store: Store<AppState>) {
  }

  recipesChanged = new Subject<Recipe[]>();

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  private recipes: Recipe[] = [
    /*    new Recipe(
          'A test recipe',
          'siple descr',
          'https://www.maxpixel.net/static/photo/1x/Food-Vegetable-White-Kidney-Bean-Recipe-2728708.jpg',
          [
            new Ingredient('meat', 1),
            new Ingredient('French Fry', 10)
          ]),
        new Recipe(
          'A test recipe 2',
          'siple descr',
          'https://www.maxpixel.net/static/photo/1x/Food-Vegetable-White-Kidney-Bean-Recipe-2728708.jpg',
          [
            new Ingredient('Buns', 2),
            new Ingredient('Tomato', 1)
          ])*/
  ];

  getRecipes() {
    return this.recipes.slice(); //return copy
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    // this.shopListService.addIngredients(ingredients);
    this.store.dispatch(new AddIngredients(ingredients));
  }


  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, recipe: Recipe) {
    this.recipes[index] = recipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
