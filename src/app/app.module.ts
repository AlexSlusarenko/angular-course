import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {AppRoutingModule} from './app-routing.module';
import {SharedModule} from './shared/shared.module';
import {CoreModule} from './core.module';
import {appReducer} from './store/app.reducer';
import {EffectsModule} from '@ngrx/effects';
import {AuthEffects} from './auth/store/auth.effects';
import {StoreRouterConnectingModule} from '@ngrx/router-store';
import {RecipeEffects} from './recipes/store/recipe.effects';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule, //unlocks http client
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([AuthEffects, RecipeEffects]),
    StoreRouterConnectingModule.forRoot(), //for demo purposes
    SharedModule,
    CoreModule,
  ],
  bootstrap: [AppComponent],
  //providers: [LoggingService] // all app single instance
})
export class AppModule {
}
