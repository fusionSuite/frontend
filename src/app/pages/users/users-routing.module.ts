import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedInGuard } from 'src/app/guards/logged-in.guard';

import { UsersCreatePageComponent } from './users-create-page/users-create-page.component';
import { UsersListPageComponent } from './users-list-page/users-list-page.component';

const routes: Routes = [
  {
    path: '',
    title: $localize `Users`,
    component: UsersListPageComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'new',
    title: $localize `New user`,
    component: UsersCreatePageComponent,
    canActivate: [LoggedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule { }
