import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interface';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gifs.mapper';
import { map, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class GifService {

  private http = inject(HttpClient);

  // Propiedad para almacenar el estado de trending
  trendingGifs = signal<Gif[]>([]);
  // Propiedad para saber si estan cargando los gifs
  trendingGifsLoading = signal(true);

  // Propiedad para almacenar nuestro historial de búsqueda
  searchHistory = signal<Record<string, Gif[]>>({})
  // Cada vez que searchHistory cambie, automáticamente se va a computar en searchHistoryKeys, actualizando su listado
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()))

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

  searchGifs(query:string) {
    // Creamos la petición Http del objeto HttpClient, pasando la variable de entorno con
    // la Url base, añadiendo la sección, seguido de los parámetros de la url de la API.
    // Devolvemos la propia petición HTTP, devolviendo un Observable
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.gifsApiKey,
        limit: 25,
        q: query,
      },
      // Con el operador pipe podemos encadenar funcionamientos de los Observable y así devolver datos determinados
    }).pipe(
      // Con map, podemos iterar cada elemento de la respuesta y obtener los datos que necesitemos
      map( ({ data }) => data),
      // Pasamos todos los items por el mapper, para obtener todos los objetos tal cual hemos diseñado en el mapper
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),
      // Para manejar el historial de búsqueda, con tap  se usa para ejecutar efectos secundarios en un observable sin alterar el valor emitido, nos permite actualizar this.searchHistory
      tap( items => {
        // update toma el estado actual (...history) de searchHistory y devuelve uno nuevo
        this.searchHistory.update( history => ({
          ...history,
          [query.toLowerCase()]: items,
        }))
      })
    );

    // .subscribe((resp) => {
    //   const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
    //   console.log({ search: resp });
    // });
  }
}
