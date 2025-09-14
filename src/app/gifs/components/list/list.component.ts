import { Component, input } from '@angular/core';
import { ItemComponent } from "./item/item.component";
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'gifs-list',
  imports: [ItemComponent],
  templateUrl: './list.component.html',
})
export class ListComponent {

  gifs = input.required<Gif[]>();

}
