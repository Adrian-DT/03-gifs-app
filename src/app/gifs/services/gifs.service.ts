import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interface';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gifs.mapper';

@Injectable({providedIn: 'root'})
export class GifService {

  private http = inject(HttpClient);

  // Propiedad para almacenar el estado de trending
  trendingGifs = signal<Gif[]>([]);
  // Propiedad para saber si estan cargando los gifs
  trendingGifsLoading = signal(true);

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
    // Creamos la petición Http del objeto HttpClient, pasando la variable de entorno con
    // la Url base, añadiendo la sección, seguido de los parámetros de la url de la API.
    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.gifsApiKey,
        limit: 20,
      }
    }).subscribe( (resp) => {
      // console.log({ resp });
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      console.log({gifs});
      this.trendingGifs.set(gifs);
      // Modificamos la propiedad que indica si estan cargandose los gifs a false, porque ya terminamos de cargar
      this.trendingGifsLoading.set(false);
    });

  }
}
