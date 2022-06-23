import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  faBatteryThreeQuarters,
  faCalculator,
  faCoins,
  faCube,
  faHdd,
  faLaptop,
  faLayerGroup,
  faList,
  faPowerOff,
  faShieldAlt,
} from '@fortawesome/free-solid-svg-icons';

import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

import { Type } from 'src/app/interfaces/type';

@Component({
  selector: '[app-page-menu]',
  templateUrl: './page-menu.component.html',
  styleUrls: ['./page-menu.component.scss']
})
export class PageMenuComponent implements OnInit {

  types: Type[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.apiService.getTypes()
      .subscribe((result: Type[]) => {
        this.types = result;
      });
  }

  typeIcon(type: Type) {
    switch (type.internalname) {
      case 'antivirus':
        return faShieldAlt;
      case 'battery':
        return faBatteryThreeQuarters;
      case 'bios':
        return faPowerOff;
      case 'controller':
        return faHdd;
      case 'laptop':
        return faLaptop;
      case 'operatinsystem':
        return faLayerGroup;
      case 'organization':
        return faList;
      case 'processor':
        return faCalculator;
      case 'software':
        return faCoins;
      default:
        return faCube;
    }
  }

  get displayName() {
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
