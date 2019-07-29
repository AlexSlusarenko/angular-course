import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';

import {PlaceholderDirecive} from '../shared/placeholder.direcive';
import {AlertComponent} from '../shared/alert/alert.component';
import {AppState} from '../store/app.reducer';
import {ClearError, LoginStart, SignupStart} from './store/auth.actions';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: ['.spinner { text-align: center}']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;
  @ViewChild(PlaceholderDirecive, {static: true}) alertHost: PlaceholderDirecive;
  private alertSub: Subscription;
  private storeSub: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
        this.isLoading = authState.loading;
        this.error = authState.authError;
        if (this.error) {
          this.showErrorAlert(this.error);
        }
      }
    );
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(authForm: NgForm) {
    if (authForm.invalid) {
      return;
    }
    this.isLoading = true;

    const email = authForm.value.email;
    const password = authForm.value.password;

    this.signupOrSignin(email, password);

    authForm.reset();
  }

  private signupOrSignin(email, password) {
    if (this.isLoginMode) {
      this.store.dispatch(new LoginStart({email, password}));
    } else {
      this.store.dispatch(new SignupStart({email, password}));
    }
  }

  onCloseError() {
    this.store.dispatch(new ClearError());
  }

  //for test purposes, create component in the code
  private showErrorAlert(message: string) {
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const hostContainerRef = this.alertHost.viewContainerRef;
    hostContainerRef.clear();

    const alertComponentRef = hostContainerRef.createComponent(alertComponentFactory);
    alertComponentRef.instance.message = message;
    this.alertSub = alertComponentRef.instance.close.subscribe(() => {
      this.alertSub.unsubscribe();
      hostContainerRef.clear();
    });
  }

  ngOnDestroy(): void {
    if (this.alertSub) {
      this.alertSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
