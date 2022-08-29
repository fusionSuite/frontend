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
