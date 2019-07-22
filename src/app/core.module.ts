import {NgModule} from '@angular/core';
import {ShoppingListService} from './shopping-list/shopping-list.service';
import {RecipeService} from './recipes/recipe.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './auth/auth-interceptor.service';

@NgModule({
  providers: [
    ShoppingListService, //for demo purposes provided here, better to use: @Injectable({providedIn: '...'})
    RecipeService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ]
  //services does not need to be exported
})
export class CoreModule {
}
