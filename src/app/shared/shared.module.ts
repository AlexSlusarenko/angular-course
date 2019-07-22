import {NgModule} from '@angular/core';
import {AlertComponent} from './alert/alert.component';
import {SpinnerComponent} from './spinner/spinner.component';
import {PlaceholderDirecive} from './placeholder.direcive';
import {DropdownDirective} from './dropdown.directive';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AlertComponent,
    SpinnerComponent,
    PlaceholderDirecive,
    DropdownDirective,

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    AlertComponent,
    SpinnerComponent,
    PlaceholderDirecive,
    DropdownDirective,
    CommonModule, //ngIf, ngFor, and other directives from BrowserModule
    ReactiveFormsModule
  ],
  entryComponents: [AlertComponent]
})
export class SharedModule {

}
