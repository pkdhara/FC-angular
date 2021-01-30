import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!!req.headers.get('skip-intercept')) {
      const headers = req.headers.delete('skip-intercept');
      req = req.clone({ headers: req.headers.delete('skip-intercept','true') });
      return next.handle(req);
    } else {
      const token = localStorage.getItem('access_token');
      const modifiedReq = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true
      });
      return next.handle(modifiedReq);
    }
  }
}
