import { Component } from '@angular/core';
import { ItemComponent } from "./item/item.component";

@Component({
  selector: 'gifs-list',
  imports: [ItemComponent],
  templateUrl: './list.component.html',
})
export class ListComponent { }
