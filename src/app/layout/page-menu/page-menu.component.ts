import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: '[app-page-menu]',
  templateUrl: './page-menu.component.html',
  styleUrls: [],
})
export class PageMenuComponent implements OnInit {
  constructor (
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit (): void {
  }

  get displayName () {
    const token = this.authService.getToken();
    if (!token) {
      return '';
    }

    const splitToken = token.split('.');
    if (splitToken.length !== 3) {
      return '';
    }

    try {
      const decodedPayload = JSON.parse(atob(splitToken[1]));
      return decodedPayload.displayname || '';
    } catch (error) {
      return '';
    }
  }

  logout () {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
