import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedInGuard } from 'src/app/guards/logged-in.guard';

import { OrganizationsCreatePageComponent } from './organizations-create-page/organizations-create-page.component';
import { OrganizationsListPageComponent } from './organizations-list-page/organizations-list-page.component';

const routes: Routes = [
  {
    path: '',
    title: $localize `Organizations`,
    component: OrganizationsListPageComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'new',
    title: $localize `New organization`,
    component: OrganizationsCreatePageComponent,
    canActivate: [LoggedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrganizationsRoutingModule { }
