import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { GifService } from '../../services/gifs.service';
import { ListComponent } from "../../components/list/list.component";

@Component({
  selector: 'app-gif-history.component',
  imports: [ListComponent],
  templateUrl: './gif-history.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GifHistoryComponent {
  // Obtenemos el service
  gifService = inject(GifService)


  // Obtenemos los parametros de la query que recibimos por URL mediante un Observable que cambiará conforme cambie el URL si lo convertimos en un signal.
  // Con toSignal, podemos pasar un Observable y convertirlo en una señal
  // Mediante pipe podemos usar operadores de rxjs para obtener los parámetros, en este caso utilizamos map para obtenerlos
  query = toSignal(
    inject(ActivatedRoute).params.pipe(
      map( params => params['query'] ?? '')
    )
  );

  // Retornamos el historial pasando por el servicio el parametro de la query de la URL.
  gifsByKey = computed(() => {
    return this.gifService.getHistoryGifs(this.query())
  })

  // inject(ActivatedRoute).params.subscribe(
  //   params => {
  //     console.log(params['query']);
  //   }
  // );

};

