import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';

import {Ingredient} from '../shared/ingredient.model';
import {StartEdit} from './store/shopping-list.actions';
import {AppState} from '../store/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Ingredient[];
  ingredientsObs: Observable<{ ingredients: Ingredient[] }>;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
    this.ingredientsObs = this.store.select('shoppingList');
  }

  ngOnDestroy(): void {
    this.ingredientsObs.subscribe();
  }

  onEditItem(i: number) {
    this.store.dispatch(new StartEdit(i));
  }
}
