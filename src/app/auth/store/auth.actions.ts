import {Action} from '@ngrx/store';
import {User} from '../user.model';

export const LOGIN_START = '[Auth] LOGIN START';
export const LOGIN_FAIL = '[Auth] LOGIN_FAIL';
export const LOGIN = '[Auth] LOGIN';
export const LOGOUT = '[Auth] LOGOUT';
export const SIGNUP_START = '[Auth] SIGNUP_START';
export const CLEAR_ERROR = '[Auth] CLEAR_ERROR';
export const AUTO_LOGIN = '[Auth] AUTO_LOGIN';

export class Login implements Action {
  readonly type: string = LOGIN;

  constructor(public payload: {user: User, redirect: boolean}) {
  }
}

export class Logout implements Action {
  readonly type: string = LOGOUT;
}

export class LoginStart implements Action {
  readonly type: string = LOGIN_START;

  constructor(public payload: { email: string, password: string; }) {
  }
}

export class LoginFail implements Action {
  readonly type: string = LOGIN_FAIL;

  constructor(public payload: string) {
  }
}

export class SignupStart implements Action {
  readonly type: string = SIGNUP_START;

  constructor(public payload: { email: string, password: string; }) {
  }
}

export class ClearError implements Action {
  readonly type: string = CLEAR_ERROR;
}

export class AutoLogin implements Action {
  readonly type: string = AUTO_LOGIN;
}

export type AuthActions = Login | Logout | LoginStart | LoginFail | SignupStart | ClearError | AutoLogin
