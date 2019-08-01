import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Recipe} from '../recipes/recipe.model';
import {RecipeService} from '../recipes/recipe.service';
import {map, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from '../store/app.reducer';
import {SetRecipes} from '../recipes/store/recipe.actions';

@Injectable({providedIn: 'root'}) //can be used in app.module, providers section
export class DataStorageService {
  url: string = 'https://angular-course-a02de.firebaseio.com/';

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private store: Store<AppState>) {
  }

  storeRecipes() {

    const recipes = this.recipeService.getRecipes();

    //firebase overwrites everything on put request
    //.json - firebase specific
    this.http.put(this.url + 'recipes.json', recipes)
      .subscribe(response => console.log(response));
  }

  fetchRecipesEffect() {
    return this.http.get<Recipe[]>(this.url + 'recipes.json');
  }

  storeRecipesEffect(recipes: Recipe[]) {
    return this.http.put(this.url + 'recipes.json', recipes);
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(this.url + 'recipes.json')
      .pipe(map(recipes => { //rxjs .map()
          return recipes.map(recipe => { //array.map()
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
          });
        }),
        tap(recipes => {
          //this.recipeService.setRecipes(recipes);
          this.store.dispatch(new SetRecipes(recipes));
        }));
  }
}
