import { Injectable, signal } from '@angular/core';
// Creamos este servicio para almacenar la posición del scroll y cargarla mediante signals
@Injectable({providedIn: 'root'})
export class ScrollStateService {
  // Sería recomendable crear métodos de control para leer y actualizar dicha señal
  trendingScrollState = signal(0);

}
