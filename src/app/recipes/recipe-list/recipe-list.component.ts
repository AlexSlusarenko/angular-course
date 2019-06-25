import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Recipe} from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  recipes: Recipe[] = [
    new Recipe('A test recipe', 'siple descr',
      'https://www.maxpixel.net/static/photo/1x/Food-Vegetable-White-Kidney-Bean-Recipe-2728708.jpg'),
    new Recipe('A test recipe 2', 'siple descr',
      'https://www.maxpixel.net/static/photo/1x/Food-Vegetable-White-Kidney-Bean-Recipe-2728708.jpg')
  ];

  @Output() recipeWasSelected = new EventEmitter<Recipe>();

  constructor() { }

  ngOnInit() {
  }

  onRecipeSelected(recipe: Recipe) {
    this.recipeWasSelected.emit(recipe);
  }
}
