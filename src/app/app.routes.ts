import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'dashboard',
    loadComponent: () => import('./gifs/pages/dashboard-page/dashboard-page.component'),
    // Rutas hijas, para cargar componentes dentro del dashboard
    children: [
      {
        path: 'trending',
        loadComponent: () => import('./gifs/pages/trending-page/trending-page.component'),
      },

      {
        path: 'search',
        loadComponent: () => import('./gifs/pages/search-page/search-page.component'),
      },

      // Podemos incluir un segmento de URL dinámico mediante los parámetros que mandemos con palabras clave :query.
      {
        path: 'history/:query',
        loadComponent: () => import('./gifs/pages/gif-history/gif-history.component'),
      },

      {
        path: '**',
        redirectTo: 'trending'
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }

];
