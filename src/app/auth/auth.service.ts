import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {AppState} from '../store/app.reducer';
import {Logout} from './store/auth.actions';

@Injectable({providedIn: 'root'})
export class AuthService {

  private firebaseApiUrl = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';
  private signupUrl = this.firebaseApiUrl + '/signupNewUser?key=' + environment.firebaseKey;
  private signinUrl = this.firebaseApiUrl + '/verifyPassword?key=' + environment.firebaseKey;

  tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<AppState>) {
  }

  loginEffect(email: string, password: string) {
    return this.http.post<AuthResponse>(this.signinUrl, {
      email: email,
      password: password,
      returnSecureToken: true
    });
  }

  signupEffect(email: string, password: string) {
    return this.http.post<AuthResponse>(this.signupUrl, {
      email: email,
      password: password,
      returnSecureToken: true
    });
  }

  setLogoutTimer(expiration: number) { //ms
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new Logout());
    }, expiration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
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
