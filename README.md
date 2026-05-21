# GifsApp

Aplicación web para buscar, visualizar y gestionar GIFs utilizando la API de Giphy. Desarrollada con Angular 20 y Tailwind CSS v4. 03-gifs-app:1-3 

## Características

- **Trending Page**: Feed infinito de GIFs populares con persistencia de scroll 03-gifs-app:18-29 
- **Search Page**: Búsqueda dinámica de GIFs por descripción, nombre o tags 03-gifs-app:2-11 
- **History Page**: Visualización de resultados de búsquedas anteriores con routing reactivo 03-gifs-app:23-32 
- **Lazy Loading**: Carga bajo demanda de componentes para optimizar rendimiento 03-gifs-app:6-24 
- **Search History**: Historial de búsquedas accesible desde el menú lateral 03-gifs-app:21-37 

## Stack Tecnológico

- **Framework**: Angular 20 03-gifs-app:23-28 
- **Estilos**: Tailwind CSS v4 03-gifs-app:23-32 
- **API**: Giphy API
- **State Management**: Angular Signals
- **Routing**: Angular Router con lazy loading

## Instalación

### Prerrequisitos

- Node.js (versión compatible con Angular 20)
- npm
- Angular CLI (`npm install -g @angular/cli`)

### Pasos de instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/Adrian-DT/03-gifs-app.git
cd 03-gifs-app
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Editar `src/environments/environment.ts` para producción
   - Editar `src/environments/environment.development.ts` para desarrollo
   - Configurar tu `gifsApiKey` de Giphy 03-gifs-app:1-15 

## Uso

### Servidor de desarrollo
```bash
npm start
```
La aplicación estará disponible en `http://localhost:4200/` 03-gifs-app:4-10 

### Build para producción
```bash
npm run build
```
Los archivos se generarán en el directorio `dist/` 03-gifs-app:32-46 

### Tests
```bash
npm test
```

## Estructura del Proyecto

```
src/app/gifs/
├── pages/
│   ├── trending-page/          # Feed de GIFs populares
│   ├── search-page/            # Búsqueda de GIFs
│   ├── gif-history/            # Historial de búsquedas
│   └── dashboard-page/         # Layout principal
├── components/
│   ├── list/                   # Componente compartido para listar GIFs
│   └── side-menu/              # Menú lateral de navegación
└── services/
    ├── gifs.service.ts         # Servicio para API de Giphy
    └── scroll-state.services.ts # Servicio para persistencia de scroll
```

## Configuración de Entorno

Las variables de entorno se configuran en los archivos:
- `src/environments/environment.ts` (Producción)
- `src/environments/environment.development.ts` (Desarrollo)

Propiedades requeridas:
- `gifsApiKey`: Tu API key de Giphy
- `giphyUrl`: URL base de la API de Giphy (`https://api.giphy.com/v1`)
- `companyName`: Nombre para branding en el menú lateral 03-gifs-app:1-10 

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia servidor de desarrollo |
| `npm run build` | Crea build de producción |
| `npm test` | Ejecuta tests unitarios |

## Notas

- El proyecto utiliza `ChangeDetectionStrategy.OnPush` para optimización de renderizado 03-gifs-app:13-13 
- La configuración de editor está estandarizada con `.editorconfig` (2 espacios, UTF-8) 03-gifs-app:4-10 
- Se recomienda usar VS Code con la configuración proporcionada en `.vscode/settings.json` 03-gifs-app:1-8 

---
**Estado**: Proyecto en construcción 03-gifs-app:1-3 

## Notes

```
**File:** src/app/gifs/pages/search-page/search-page.component.html (L2-11)
```html
<h2 class="text-2xl font-bold mt-5">Buscar Gifs</h2>
<h3 class="text-sm text-gray-500">Buscar por descripción, nombre o tags</h3>
<!-- Con el evento keyup.enter definimos que queremos capturar el texto del input cuando pulsemos Enter, en la referencia local #txtSearch -->
<section class="flex flex-col gap-4">
  <input type="text"
    placeholder="Buscar Gifs"
    class="mt-3 border border-gray-300 rounded-m p-2"
    (keyup.enter)="onSearch(txtSearch.value)"
    #txtSearch
    />
```
**File:** src/app/app.routes.ts (L6-24)
```typescript
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
```
**File:** src/app/gifs/components/side-menu/side-menu-options/side-menu-options.component.html (L21-37)
```html
  <!-- Mediante un bucle for recorremos las claves de búsqueda que hemos utilizado en el historial y las añadimos en el side bar menu -->
  @for (key of gifService.searchHistoryKeys(); track key) {
        <!-- Pasamos por el routerLink la key como parámetro para pasarlo por la ruta del history, esto generara un link con el parámetro que pongamos en la búsqueda ejemplo /dashboard/hisotry/doraemon -->
        <a
      [routerLink]="['/dashboard/history', key]"
      routerLinkActive="bg-blue-800"
      class="w-full px-2 inline-flex space-x-2 items-center border-b border-slate-700 py-3  hover:bg-white/5 transition ease-linear duration-150"
    >
      <div>
        <i class="fa-solid fa-clock-rotate-left"></i>
      </div>
      <div class="flex flex-col">
        <span class="text-lg font-bold leading-5 text-white">{{ key }}</span>
      </div>
    </a>

  }
```
**File:** .editorconfig (L4-10)
```text
[*]
charset = utf-8
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

```
