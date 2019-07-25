import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../store/app.reducer';
import {exhaustMap, map, take} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private store: Store<AppState>) {
  }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        return authState.user;
      }),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }

        const modifiedReq = req.clone({params: new HttpParams().set('auth', user.token)});
        return next.handle(modifiedReq);
      })
    );
  }

  //exhaustMap - observable that will return observable
}
