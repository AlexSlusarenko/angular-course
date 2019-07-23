import {Component, ComponentFactoryResolver, OnDestroy, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthResponse, AuthService} from './auth.service';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AlertComponent} from '../shared/alert/alert.component';
import {PlaceholderDirecive} from '../shared/placeholder.direcive';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styles: ['.spinner { text-align: center}']
})
export class AuthComponent implements OnDestroy{

  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;
  @ViewChild(PlaceholderDirecive, {static: true}) alertHost: PlaceholderDirecive;
  private alertSub: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver) {
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

    const authObs = this.signupOrSignin(email, password);

    authObs.subscribe(response => {
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, errorMessage => {
      this.error = errorMessage;
      this.isLoading = false;
      this.showErrorAlert(errorMessage);
    });

    authForm.reset();
  }

  private signupOrSignin(email, password) {
    let authObs: Observable<AuthResponse>;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }
    return authObs;
  }

  onCloseError() {
    this.error = null;
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
  }
}
