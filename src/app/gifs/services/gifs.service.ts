import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interface';

@Injectable({providedIn: 'root'})
export class GifService {

  private http = inject(HttpClient);

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
    });

  }
}
