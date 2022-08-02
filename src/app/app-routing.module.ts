import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedInGuard } from './guards/logged-in.guard';
import { NotLoggedInGuard } from './guards/not-logged-in.guard';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { OrganizationsCreatePageComponent } from './pages/organizations/organizations-create-page/organizations-create-page.component';

const routes: Routes = [
  {
    path: '',
    title: $localize `FusionSuite`,
    component: HomePageComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: 'login',
    title: $localize `Log in to FusionSuite`,
    component: LoginPageComponent,
    canActivate: [NotLoggedInGuard],
  },

  {
    path: 'organizations/new',
    title: $localize `New organization`,
    component: OrganizationsCreatePageComponent,
    canActivate: [LoggedInGuard],
  },

  {
    path: '**',
    title: $localize `Page not found`,
    component: NotFoundPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
