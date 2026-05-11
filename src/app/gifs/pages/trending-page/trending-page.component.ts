import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { ListComponent } from "../../components/list/list.component";
import { GifService } from '../../services/gifs.service';

@Component({
  selector: 'app-trending-page',
  // imports: [ListComponent],
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent {

  // Inyectamos el gifService para obtener la información de la petición get de la API.
  gifService = inject(GifService);

  // Creamos una propiedad para obtener la información referenciada de un elemento del div, pasando como selector la referencia del html #groupDiv
  scrollDivRef = viewChild<ElementRef>('groupDiv');

  onScroll(event: Event) {
    // Obtenemos el elemento del scrollDivRef
    const scrollDiv = this.scrollDivRef()?.nativeElement;
  }

}
