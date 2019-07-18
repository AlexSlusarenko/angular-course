import {Component} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AuthResponse, AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent {

  constructor(private authService: AuthService,
              private router: Router) {
  }

  isLoginMode: boolean = true;
  isLoading: boolean = false;
  error: string = null;

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
}
