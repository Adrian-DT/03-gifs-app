import { Component, inject, signal } from '@angular/core';
import { ListComponent } from "../../components/list/list.component";
import { GifService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'app-search-page',
  imports: [ListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent {

  // Inyectamos el gifService para obtener la información de la petición get de la API.
  gifService = inject(GifService);

  gifs = signal<Gif[]>([]);

  onSearch(query:string) {
    //console.log({ query });
    // Como la funcion searchGifs del servicio, devuelve la petición http, podemos usar subscribe y utilizar la respuesta
    this.gifService.searchGifs(query)
    .subscribe( resp => {
      // Pasamos la respuesta y seteamos los gifs
      this.gifs.set(resp);
    });
  }

}
