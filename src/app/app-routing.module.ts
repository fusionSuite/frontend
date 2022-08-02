import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoggedInGuard } from './guards/logged-in.guard';
import { NotLoggedInGuard } from './guards/not-logged-in.guard';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { TypeShowPageComponent } from './pages/type-show-page/type-show-page.component';

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
    path: 'types/:id',
    title: $localize `Type`,
    component: TypeShowPageComponent,
    canActivate: [LoggedInGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
