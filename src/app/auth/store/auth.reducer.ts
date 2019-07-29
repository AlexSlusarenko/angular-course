import {User} from '../user.model';
import * as fromAuthActions from './auth.actions';
import {LoginFail} from './auth.actions';

export interface AuthState {
  user: User;
  authError: string;
  loading: boolean;
}

const initialAuthState: AuthState = {
  user: null,
  authError: null,
  loading: false,
};

export function authReducer(
  state: AuthState = initialAuthState,
  action: fromAuthActions.AuthActions
) {
  switch (action.type) {
    case fromAuthActions.LOGIN:
      const loginAction = (action as fromAuthActions.Login);
      return {
        ...state,
        user: loginAction.payload,
        authError: null,
        loading: false,
      };

    case fromAuthActions.LOGOUT:
      return {
        ...state,
        user: null,
        authError: null,
      };

    case fromAuthActions.LOGIN_START:
    case fromAuthActions.SIGNUP_START:
      return {
        ...state,
        authError: null,
        loading: true,
      };

    case fromAuthActions.LOGIN_FAIL:
      const loginFailedAction = (action as LoginFail);
      return {
        ...state,
        user: null,
        authError: loginFailedAction.payload,
        loading: false,
      };

    case fromAuthActions.CLEAR_ERROR:
      return {
        ...state,
        authError: null
      };

    default:
      return state;
  }
}
