import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor (
  ) { }

  private token = '';

  public login (token: string) {
    this.token = token;
    window.localStorage.setItem('authentication_token', token);
  }

  public isLoggedIn () {
    return this.getToken() !== '';
  }

  public getToken () {
    if (!this.token) {
      this.token = window.localStorage.getItem('authentication_token') || '';
    }
    return this.token;
  }

  public getTokenPayload () {
    const token = this.getToken();
    if (!token) {
      return {};
    }

    const splitToken = token.split('.');
    if (splitToken.length !== 3) {
      return {};
    }

    try {
      return JSON.parse(atob(splitToken[1]));
    } catch (error) {
      return {};
    }
  }

  public logout () {
    this.token = '';
    window.localStorage.removeItem('authentication_token');
  }
}
