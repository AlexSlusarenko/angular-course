import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

import {Ingredient} from '../../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') shoppingListForm: NgForm;
  editSub: Subscription;
  editMode = false;
  editItemIndex: number;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService) {
  }

  ngOnInit() {
    this.editSub = this.slService.editing
      .subscribe((index: number) => {
        this.editMode = true;
        this.editItemIndex = index;
        this.editedItem = this.slService.getIngredient(index);
        this.shoppingListForm.setValue({
          'name': this.editedItem.name,
          'amount': this.editedItem.amount
        });
      });
  }

  ngOnDestroy(): void {
    this.editSub.unsubscribe();
  }

  onAddItem(form: NgForm) {
    const newIngredient = new Ingredient(
      form.value.name,
      form.value.amount
    );

    if (this.editMode) {
      this.slService.updateIngredient(this.editItemIndex, newIngredient);
    } else {
      this.slService.addIngredient(newIngredient);
    }

    form.reset();
    this.editMode = false;
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.slService.deleteIngredient(this.editItemIndex);
    this.onClear();
  }
}
