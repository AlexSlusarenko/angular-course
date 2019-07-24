import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Store} from '@ngrx/store';

import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from './shopping-list.service';
import {AppState} from './store/shopping-list.reducer';
import {StartEdit} from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Ingredient[];
  private ingredientsChangedSub: Subscription;
  private ingredientsObs: Observable<{ ingredients: Ingredient[] }>;

  constructor(private shopListService: ShoppingListService,
              private store: Store<AppState>) {
  }

  ngOnInit() {
    this.ingredientsObs = this.store.select('shoppingList');

    /*    this.ingredients = this.shopListService.getIngredients();
        this.ingredientsChangedSub = this.shopListService.ingredientsChangedSub
          .subscribe((ingredients: Ingredient[]) => {
            this.ingredients = ingredients;
          });*/
  }

  ngOnDestroy(): void {
    //this.ingredientsChangedSub.unsubscribe();
  }

  onEditItem(i: number) {
    // this.shopListService.editing.next(i);
    this.store.dispatch(new StartEdit(i));
  }
}
