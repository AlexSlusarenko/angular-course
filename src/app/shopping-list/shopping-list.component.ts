import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from './shopping-list.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Ingredient[];
  private ingredientsChangedSub: Subscription;

  constructor(private shopListService: ShoppingListService) {
  }

  ngOnInit() {
    this.ingredients = this.shopListService.getIngredients();
    this.ingredientsChangedSub = this.shopListService.ingredientsChangedSub
      .subscribe((ingredients: Ingredient[]) => {
        this.ingredients = ingredients;
      });
  }

  ngOnDestroy(): void {
    this.ingredientsChangedSub.unsubscribe();
  }

  onEditItem(i: number) {
    this.shopListService.editing.next(i);
  }
}
