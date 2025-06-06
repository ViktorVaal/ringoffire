import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), provideClientHydration(), 
    provideAnimationsAsync(), 
    provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-a428e","appId":"1:516521627037:web:6073dbe7fe0da323d1b374","storageBucket":"ring-of-fire-a428e.firebasestorage.app","apiKey":"AIzaSyBXS3v7_eLVXkILlTWFjtxNCOmKCw5D11k","authDomain":"ring-of-fire-a428e.firebaseapp.com","messagingSenderId":"516521627037"})), provideFirestore(() => getFirestore())]
};
