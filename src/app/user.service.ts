import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './model/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = 'http://localhost:8081/api/user';
  constructor(private http: HttpClient) { }

  getUsers(): Observable<any> {
    return this.http.get(
      this.url
    );
  }

  createUser(user: User): Observable<any> {
    return this.http.post(this.url + '/userInfo', user);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get(
      this.url + '/' + id
    );
  }

  getAccess(): Observable<any> {
    return this.http.get(
      this.url + '/accessfeature',
    );
  }

  getToken(user: string, pass: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Authorization': 'Basic ' + btoa('fc-client:fc-client-secret'),
      'skip-intercept': 'true'
    });
    const payload = `username=${user}&password=${pass}&grant_type=password`;
    return this.http.post(
      'http://localhost:8081/oauth/token', payload, { headers: headers }
    );
  }

  refreshToken(refreshToken: string) {
    let isTokenSet = false;
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Authorization': 'Basic ' + btoa('fc-client:fc-client-secret'),
      'skip-intercept': 'true'
    });
    const payload = `refresh_token=${refreshToken}&grant_type=refresh_token`;
    return this.http.post(
      'http://localhost:8081/oauth/token', payload, { headers: headers }
    );
  }

  getSessionUser() {
    return this.http.get(
      'http://localhost:8081/api/common/session'
    );
  }

  getDashboardLocation(password: string, username: string) {
    let params = new HttpParams();
    params = params.append('password', password);
    params = params.append('username', username);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Credentials' : 'true',
      // 'skip-intercept' : 'true',
      // "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Methods": "GET",
      // "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers" 
    });
    return this.http.get(
      "https://localhost:8443/loginByPass",
      {
        params: params,
        headers: headers
      }
    );
  }
}
