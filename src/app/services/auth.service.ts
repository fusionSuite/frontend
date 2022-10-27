/**
 * FusionSuite - Frontend
 * Copyright (C) 2022 FusionSuite
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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

  public storeRefreshToken (token: string) {
    window.localStorage.setItem('authentication_refreshtoken', token);
  }

  public getRefreshToken () {
    return window.localStorage.getItem('authentication_refreshtoken') || '';
  }

  public logout () {
    this.token = '';
    window.localStorage.removeItem('authentication_token');
  }
}
