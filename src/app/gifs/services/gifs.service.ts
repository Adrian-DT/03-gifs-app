import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interface';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gifs.mapper';
import { map, Observable, tap } from 'rxjs';

// Constante para almacenar la palabra clave utilizada para almacenar y obtener del localStorage
const GIF_KEY = 'gifs'


// Función para cargar el localStorage
const loadFromLocalStorage = () => {
  // Obtenemos la palabra clave con la que almacenamos ese localStorage
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  // Parseamos a JSON lo obtenido del localStorage
  const gifs = JSON.parse( gifsFromLocalStorage );

  return gifs;
}


@Injectable({providedIn: 'root'})
export class GifService {

  private http = inject(HttpClient);

  // Propiedad para almacenar el estado de trending
  trendingGifs = signal<Gif[]>([]);
  // Propiedad para saber si estan cargando los gifs
  trendingGifsLoading = signal(false);
  // Creamos una propiedad privada, que será una signal porque irá cambiando, iniciamos con la página 0, para controlar el número de páginas cargadas para el scroll infinito de la API
  private trendingPage = signal(0);

  // Propiedad computada para generar grupos de 3 gifs en array, para el diseño Masonry
  trendingGifGroup = computed<Gif[][]>(()=> {
    const groups = [];

    // Recorremos el bucle for de 3 en 3
    for(let i = 0; i < this.trendingGifs().length; i+=3) {
      // Añadiomos las 3 posiciones desde el valor de i
      groups.push(this.trendingGifs().slice(i, i + 3))
    }
    // console.log(groups);
    return groups;
  })

  // Propiedad para almacenar nuestro historial de búsqueda, cargando del localStorage en caso de que exista algo
  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage())
  // Cada vez que searchHistory cambie, automáticamente se va a computar en searchHistoryKeys, actualizando su listado
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()))

  constructor() {
    this.loadTrendingGifs();
  }

  // Efecto para almacenar en el local storage como strings, el historial de búsqueda
  saveGifsToLocalStorage = effect(() => {
    // Cada vez que el searchHistory cambie (es un signal), el efecto se ejecutará y se almacenará en el local storage
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString)
  })

  loadTrendingGifs() {

    // Controlamos que solo haya una petición lanzada a la API, si ya existe, salimos de la función con return
    if (this.trendingGifsLoading()) return;

    // Colocamos el set en true para que no vuelva a entrar y entre en el return anterior, más abajo cuando hacemos el mapper, lo colocaremos en set false
    this.trendingGifsLoading.set(true);

    // Creamos la petición Http del objeto HttpClient, pasando la variable de entorno con
    // la Url base, añadiendo la sección, seguido de los parámetros de la url de la API.
    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.gifsApiKey,
        limit: 20,
        offset: this.trendingPage() * 20, // Colocamos el offset de la petición, los resultados obtenidos son de 20 en 20
      }
    }).subscribe( (resp) => {
      // console.log({ resp });
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      // console.log({gifs});
      // Con update, actualizamos el trendingGifs con los nuevos obtenidos del servicio API
      this.trendingGifs.update( currentGifs => [ ...currentGifs, ...gifs ]);
      // Aumentamos la página de gifs para cargar los siguientes 20
      this.trendingPage.update(page => page + 1 );
      // Modificamos la propiedad que indica si estan cargandose los gifs a false, porque ya terminamos de cargar
      this.trendingGifsLoading.set(false);
    });

  }

  searchGifs(query:string): Observable<Gif[]> {
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
        this.searchHistory.update( history => ({ ...history, [query.toLowerCase()]: items,}))
      })
    );

    // .subscribe((resp) => {
    //   const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
    //   console.log({ search: resp });
    // });
  }

  // Método para devolver el historial de búsqueda
  getHistoryGifs( query: string ): Gif[] {
    return this.searchHistory()[query] ?? [];
  }
}
