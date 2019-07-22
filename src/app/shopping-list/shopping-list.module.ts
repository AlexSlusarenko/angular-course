import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {ShoppingListComponent} from './shopping-list.component';
import {ShoppingEditComponent} from './shopping-edit/shopping-edit.component';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent,
  ],
  imports: [
    FormsModule,
    SharedModule,
    RouterModule.forChild([{path: 'shopping-list', component: ShoppingListComponent},])
  ]

})
export class ShoppingListModule {

}
