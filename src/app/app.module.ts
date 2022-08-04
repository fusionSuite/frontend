import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SettingsService } from './services/settings.service';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

import { PageComponent } from './layout/page/page.component';
import { PageMenuComponent } from './layout/page-menu/page-menu.component';

function initializeApp (settings: SettingsService) {
  return () => settings.loadConfiguration();
}

@NgModule({
  declarations: [
    AppComponent,

    HomePageComponent,
    LoginPageComponent,

    PageComponent,
    PageMenuComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FontAwesomeModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [SettingsService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor (library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
