import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';

import {Recipe} from './recipe.model';
import {Store} from '@ngrx/store';
import {AppState} from '../store/app.reducer';
import {FetchRecipes, SET_RECIPES} from './store/recipe.actions';
import {Actions, ofType} from '@ngrx/effects';
import {map, switchMap, take} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {

  constructor(private store: Store<AppState>,
              private $actions: Actions) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    // return this.dataStorageService.fetchRecipes();

    return this.store.select('recipes').pipe(
      take(1),
      map(recipesState => recipesState.recipes),
      switchMap((recipes: Recipe[]) => {
        if (recipes.length === 0) {

          this.store.dispatch(new FetchRecipes()); //fetch from server
          return this.$actions.pipe(
            ofType(SET_RECIPES),
            take(1));
        } else {
          return of(recipes); //get loaded
        }

      }));
  }

}
