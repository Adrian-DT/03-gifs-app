import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { GifService } from '../../services/gifs.service';
import { ScrollStateService } from '../../../shared/services/scroll-state.services';

@Component({
  selector: 'app-trending-page',
  // imports: [ListComponent],
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent implements AfterViewInit{

  // Inyectamos el gifService para obtener la información de la petición get de la API.
  gifService = inject(GifService);
  // Injectamos el servicio que usaremos para el control de la posición del scroll
  scrollStateService = inject(ScrollStateService);

  // Creamos una propiedad para obtener la información referenciada de un elemento del div, pasando como selector la referencia del html #groupDiv
  scrollDivRef = viewChild<ElementRef<HTMLDivElement>>('groupDiv');

  // Implementando el AfterViewInit, podemos utilizar métodos para cuando la vista ya está inicializada, cuando los componentes fueron renderizados
  // Esta función se ejecutará tan pronto la vista sea inicializada, en ella comprobaremos la posición del scroll
  ngAfterViewInit(): void {
    // Obtenemos el elemento del scrollDivRef
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    // Si no existe scroll simplemente salimos con return
    if (!scrollDiv) return;
    // Establecemos el scrollTop del valor obtenido en la señal del servicio donde lo almacenamos
    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();
  }

  onScroll(event: Event) {
    // Obtenemos el elemento del scrollDivRef
    const scrollDiv = this.scrollDivRef()?.nativeElement;
    // Si no existe scroll simplemente salimos con return
    if (!scrollDiv) return;

    // Variable para obtener cuántos px de scroll se ha movido hacia arriba
    const scrollTop = scrollDiv.scrollTop;
    // Variable para saber los px que se muestran por alto en el cliente web, del Viewport
    const clientHeight = scrollDiv.clientHeight;
    // Variable para obtener el tamaño máximo de alto para hacer scroll
    const scrollHeight = scrollDiv.scrollHeight
    // console.log({scrollTotal: scrollTop + clientHeight, scrollHeight});
    // Para conocer cuando estamos llegando al final del scroll, debemos sumar el scrollTop y el clientHeight y ver si igualamos o nos aproximamos al alto total del scrollHeight para demandar
    // más contenido a cargar
    // Variable para conocer si estamos en el final del scroll, obtendremos un boolean si se cumple la condición, para evitar llegar al final, le metemos un margen de 300px
    // para obtener el boolean que nos realizará una nueva petición de carga de contenido
    const isABottom = scrollTop + clientHeight + 300 >= scrollHeight;
    // console.log({isABottom});

    //Pasamos el valor del scroll al servicio que controlara dicha posición para cuando nos movamos entre secciones y volvamos
    this.scrollStateService.trendingScrollState.set(scrollTop);

    // Si se cumple la condición, solicitaremos cargar más contenido al servicio
    if (isABottom) {
      this.gifService.loadTrendingGifs();
    }


  }

}
