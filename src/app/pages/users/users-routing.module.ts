import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedInGuard } from 'src/app/guards/logged-in.guard';

import { UsersCreatePageComponent } from './users-create-page/users-create-page.component';

const routes: Routes = [
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
