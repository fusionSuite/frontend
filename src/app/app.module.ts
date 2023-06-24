/**
 * FusionSuite - Frontend
 * Copyright (C) 2022 FusionSuite
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

import { LayoutModule } from 'src/app/layout/layout.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

import { NotificationsComponent } from './notifications/notifications.component';
import { httpInterceptorProviders } from './services/auth.interceptor';
import { InitappService } from './services/initapp.service';
import { TimelineModule } from './timeline/timeline.module';
import { WorkflowModule } from './workflow/workflow.module';
import { SortbypipeModule } from './utils/sortbypipe.module';
import { IconchoiceModule } from './modal/iconchoice/timelineiconchoice.module';
import { DndModule } from 'ngx-drag-drop';
import { NgSelectModule } from '@ng-select/ng-select';
import { SortablejsModule } from '@dustfoundation/ngx-sortablejs';

function initializeApp (initapp: InitappService) {
  return () => initapp.loadConfiguration();
}

@NgModule({
  declarations: [
    AppComponent,

    HomePageComponent,
    LoginPageComponent,
    NotFoundPageComponent,

    NotificationsComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FontAwesomeModule,
    LayoutModule,
    ReactiveFormsModule,
    NgSelectModule,
    TimelineModule,
    WorkflowModule,
    SortbypipeModule,
    IconchoiceModule,
    SortablejsModule.forRoot({ animation: 150 }),
    DndModule,
  ],
  providers: [
    httpInterceptorProviders,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [InitappService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor (library: FaIconLibrary) {
    library.addIconPacks(fas, far, fab);
  }
}
