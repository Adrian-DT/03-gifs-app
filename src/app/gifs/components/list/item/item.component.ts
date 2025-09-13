import { Component, input } from '@angular/core';

@Component({
  selector: 'gifs-item',
  imports: [],
  templateUrl: './item.component.html',
})
export class ItemComponent {

  imageURL = input.required<string>()

}
