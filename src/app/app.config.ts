import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideNgxMask } from 'ngx-mask';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(
      withFetch(),
      // registering interceptors
      withInterceptorsFromDi()),
      {
        provide:HTTP_INTERCEPTORS,
        useClass:JwtInterceptor,
        multi:true
      },    
    provideToastr({
      timeOut: 8000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    provideNgxMask()
  ],
};
