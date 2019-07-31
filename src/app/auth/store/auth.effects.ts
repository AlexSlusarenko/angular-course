import {Actions, Effect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {AUTO_LOGIN, LOGIN, Login, LOGIN_START, LoginFail, LoginStart, LOGOUT, SIGNUP_START, SignupStart} from './auth.actions';
import {AuthResponse, AuthService} from '../auth.service';
import {User} from '../user.model';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class AuthEffects {

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(SIGNUP_START),
    switchMap((signapAction: SignupStart) => {
      return this.authService.signupEffect(signapAction.payload.email, signapAction.payload.password)
        .pipe(
          map(this.handleAuth),
          catchError(this.handleError),
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(LOGIN_START), //filter by action type
    switchMap((authData: LoginStart) => {
      return this.authService.loginEffect(authData.payload.email, authData.payload.password)
        .pipe(
          map(this.handleAuth),
          catchError(this.handleError),
        );
    })
  );

  @Effect({dispatch: false}) //do not return a new action
  authRedirect = this.actions$.pipe(
    ofType(LOGIN),
    tap((loginAction: Login) => {
      if (loginAction.payload.redirect) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
      localStorage.removeItem('userData');
      this.router.navigate(['/auth']);
    })
  );

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return {type: 'DUMMY'};
      }

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );

      if (loadedUser.token) {
        this.authService.setLogoutTimer(loadedUser._tokenExpirationDate.getTime() - new Date().getTime());
        return new Login({user: loadedUser, redirect: false});
      }

      return {type: 'DUMMY'};
    })
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router) { //Actions - observable, stream of dispatched actions
  }

  private handleAuth = (resData: AuthResponse) => {
    const expiration = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    const user = new User(resData.email, resData.localId, resData.idToken, expiration);
    localStorage.setItem('userData', JSON.stringify(user));

    this.authService.setLogoutTimer(+resData.expiresIn * 1000);

    return new Login({user: user, redirect: true});
  };

  private handleError = (errorRes: HttpErrorResponse) => {
    let errorMessage = 'Some error happened ;(';

    if (!errorRes.error || !errorRes.error.error) {
      return of(new LoginFail(errorMessage));
    }

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'The email address is already in use by another account.';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'Password sign-in is disabled for this project.';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'The password is invalid or the user does not have a password.';
        break;
      case 'USER_DISABLED':
        errorMessage = 'The user account has been disabled by an administrator.';
        break;
    }
    return of(new LoginFail(errorMessage));
  };
}
