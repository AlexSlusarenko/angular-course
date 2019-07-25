import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

import {Ingredient} from '../../shared/ingredient.model';
import {Store} from '@ngrx/store';
import * as ShoppingListActions from '../store/shopping-list.actions';
import {DeleteIngredient, StopEdit} from '../store/shopping-list.actions';
import {ShoppingListState} from '../store/shopping-list.reducer';
import {AppState} from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: true}) shoppingListForm: NgForm;
  editSub: Subscription;
  editMode = false;
  editedItem: Ingredient;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit() {
    this.editSub = this.store.select('shoppingList').subscribe((stateData: ShoppingListState) => {
      if (stateData.editedIngredientIndex > -1) {
        this.editMode = true;
        this.editedItem = stateData.editedIngredient;
        this.shoppingListForm.setValue({
          'name': this.editedItem.name,
          'amount': this.editedItem.amount
        });
      } else {
        this.editMode = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.editSub.unsubscribe();
    this.store.dispatch(new StopEdit());
  }

  onAddItem(form: NgForm) {
    const newIngredient = new Ingredient(
      form.value.name,
      form.value.amount
    );

    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(newIngredient));
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(newIngredient));
    }

    form.reset();
    this.editMode = false;
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
    this.store.dispatch(new StopEdit());
  }

  onDelete() {
    this.store.dispatch(new DeleteIngredient());
    this.onClear();
  }
}
