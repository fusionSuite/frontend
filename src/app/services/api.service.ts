import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from 'src/app/services/auth.service';

import { Type } from 'src/app/interfaces/type';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor (
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  public login (username: string, password: string) {
    return this.http.post('/api/v1/token', {
      login: username,
      password,
    });
  }

  public getTypes () {
    return this.http.get<Type[]>('/api/v1/config/types', {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }

  public getType (id: number) {
    return this.http.get<Type>('/api/v1/config/types/' + id, {
      headers: {
        Authorization: 'Bearer ' + this.authService.getToken(),
      },
    });
  }
}
