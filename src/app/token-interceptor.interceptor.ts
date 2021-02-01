import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap, catchError, switchMap, take, filter } from "rxjs/operators";
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {

  lastRequest: HttpRequest<any> | null = null;
  private refreshTokenInProgress = false;
  private refreshTokenSubject: Subject<any> = new BehaviorSubject<any>(null);
  constructor(private router: Router, private userService: UserService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    let modifiedReq;
    if (!!req.headers.get('skip-intercept')) {
      modifiedReq = req.clone({ headers: req.headers.delete('skip-intercept', 'true') });
      return next.handle(modifiedReq);
    } else {
      this.lastRequest = req.clone();
      let tokenExpirationTime = localStorage.getItem('expires_by');
      let currentTime = (new Date()).getTime() - 1000;
      if (!!tokenExpirationTime && !isNaN(Number(tokenExpirationTime))) {
        if (Number(tokenExpirationTime) < currentTime) {
          let refreshToken = localStorage.getItem('refresh_token');
          if (!!refreshToken) {
            if (!this.refreshTokenInProgress) {
              this.refreshTokenInProgress = true;
              this.refreshTokenSubject.next(null);
              return this.userService.refreshToken(refreshToken).pipe(
                switchMap((token: any) => {
                  let currentTime = new Date();
                  localStorage.setItem('access_token', token['access_token']);
                  localStorage.setItem('refresh_token', token['refresh_token']);
                  currentTime.setTime(currentTime.getTime() + (token['expires_in'] * 1000) - 10);
                  localStorage.setItem('expires_by', currentTime.getTime().toString());
                  this.refreshTokenInProgress = false;
                  this.refreshTokenSubject.next(token.refresh_token);
                  return next.handle(this.injectToken(req));
                })
              );
            } else {
              return this.refreshTokenSubject.pipe(
                filter(result => result !== null),
                take(1),
                switchMap((res) => {
                  return next.handle(this.injectToken(req))
                })
              );
            }
          } else {
            this.router.navigate(['']);
            return new Observable<any>();
          }
        } else {
          modifiedReq = this.injectToken(req);
          return next.handle(modifiedReq);
        }
      } else {
        this.router.navigate(['']);
        return new Observable<any>();
      }
    }
  }

  injectToken(request: HttpRequest<any>) {
    const token = localStorage.getItem('access_token');
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
  }
}
