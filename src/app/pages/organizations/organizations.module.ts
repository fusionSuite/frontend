import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { LayoutModule } from 'src/app/layout/layout.module';

import { OrganizationsRoutingModule } from './organizations-routing.module';

import { OrganizationsCreatePageComponent } from './organizations-create-page/organizations-create-page.component';
import { OrganizationsListPageComponent } from './organizations-list-page/organizations-list-page.component';

@NgModule({
  declarations: [
    OrganizationsCreatePageComponent,
    OrganizationsListPageComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    LayoutModule,
    OrganizationsRoutingModule,
    ReactiveFormsModule,
  ],
})
export class OrganizationsModule { }
