import {Actions, Effect, ofType} from '@ngrx/effects';
import {FETCH_RECIPES, SetRecipes, STORE_RECIPES} from './recipe.actions';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {DataStorageService} from '../../shared/data-storage.service';
import {Recipe} from '../recipe.model';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {

  constructor(private dataStorage: DataStorageService,
              private $actions: Actions,
              private store: Store<AppState>) {
  }

  @Effect()
  fetchRecipes = this.$actions
    .pipe(ofType(FETCH_RECIPES),
      switchMap(() => this.dataStorage.fetchRecipesEffect()),
      map((recipes: Recipe[]) => { //rxjs .map()
        return recipes.map(recipe => { //array.map()
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
        });
      }),
      map(recipes => {
        return new SetRecipes(recipes);
      }));

  @Effect({dispatch: false})
  storeEffect = this.$actions
    .pipe(ofType(STORE_RECIPES),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([action, recipesState]) => {

        return this.dataStorage.storeRecipesEffect(recipesState.recipes);
      }));

}
