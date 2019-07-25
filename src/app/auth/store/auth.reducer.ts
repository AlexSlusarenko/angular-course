import {User} from '../user.model';
import * as fromAuthActions from './auth.actions';

export interface AuthState {
  user: User;
}

const initialAuthState: AuthState = {
  user: null
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
        user: loginAction.payload
      };

    case fromAuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };

    default:
      return state;
  }
}
