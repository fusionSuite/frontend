import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedInGuard } from './logged-in.guard';
import { NotLoggedInGuard } from './not-logged-in.guard';

import { HomePageComponent } from './home-page/home-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { TypeShowPageComponent } from './type-show-page/type-show-page.component';

const routes: Routes = [
  {
    path: '',
    title: 'FusionSuite',
    component: HomePageComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'login',
    title: 'Log in to Fusion Suite',
    component: LoginPageComponent,
    canActivate: [NotLoggedInGuard],
  },
  {
    path: 'types/:id',
    title: 'Type',
    component: TypeShowPageComponent,
    canActivate: [LoggedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
