import {Recipe} from './recipe.model';
import {EventEmitter} from '@angular/core';

export class RecipeService {

  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe('A test recipe', 'siple descr',
      'https://www.maxpixel.net/static/photo/1x/Food-Vegetable-White-Kidney-Bean-Recipe-2728708.jpg'),
    new Recipe('A test recipe 2', 'siple descr',
      'https://www.maxpixel.net/static/photo/1x/Food-Vegetable-White-Kidney-Bean-Recipe-2728708.jpg')
  ];

  getRecipes() {
    return this.recipes.slice(); //return copy
  }


}
