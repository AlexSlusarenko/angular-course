import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {BehaviorSubject, throwError} from 'rxjs';
import {User} from './user.model';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {AppState} from '../store/app.reducer';
import {Login, Logout} from './store/auth.actions';

@Injectable({providedIn: 'root'})
export class AuthService {

  private firebaseApiUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';
  private signupUrl = this.firebaseApiUrl + '/signupNewUser?key=' + environment.firebaseKey;
  private signinUrl = this.firebaseApiUrl + '/verifyPassword?key=' + environment.firebaseKey;

  userSubject = new BehaviorSubject<User>(null);

  tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<AppState>) {
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(this.signinUrl, {
      email: email,
      password: password,
      returnSecureToken: true
    })
      .pipe(catchError(this.handleError), tap(this.handleAuthentication.bind(this)));
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponse>(this.signupUrl, {
      email: email,
      password: password,
      returnSecureToken: true
    }) //tap() allow to perform some action without changing the response
      .pipe(catchError(this.handleError), tap(this.handleAuthentication.bind(this)));
  }

  logout() {
    this.store.dispatch(new Logout());
    this.router.navigate(['/auth']);

    localStorage.removeItem('userData');  //localStorage.clear() - to clear everything

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expiration: number) { //ms
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expiration);
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
      this.store.dispatch(new Login(loadedUser));
      const expiration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();

      this.autoLogout(expiration);
    }
  }

  private handleAuthentication(resData) {

    const expiration = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    const user = new User(resData.email, resData.localId, resData.idToken, expiration);
    this.store.dispatch(new Login(user));

    this.autoLogout((expiration.getTime() - new Date().getTime()));

    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'Some error happened ;(';

    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
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
    return throwError(errorMessage);
  }
}

export interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
