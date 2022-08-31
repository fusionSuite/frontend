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

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule).catch(error => {
  const loadingElement = document.querySelector('#app-loading') as HTMLElement;
  if (loadingElement) {
    loadingElement.hidden = true;
  }

  const errorElement = document.querySelector('#app-error') as HTMLElement;

  let message = 'Application initialization failed';
  if (error && error.message) {
    message = message + ': ' + error.message;
  } else if (error) {
    message = message + ': ' + error;
  }

  if (errorElement) {
    errorElement.textContent = message;
    errorElement.hidden = false;
  }

  console.error(message);
});
