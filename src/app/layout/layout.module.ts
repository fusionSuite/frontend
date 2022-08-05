import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PageComponent } from './page/page.component';
import { PageMenuComponent } from './page-menu/page-menu.component';

@NgModule({
  declarations: [
    PageComponent,
    PageMenuComponent,
  ],
  exports: [
    PageComponent,
    PageMenuComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
  ],
})
export class LayoutModule { }
