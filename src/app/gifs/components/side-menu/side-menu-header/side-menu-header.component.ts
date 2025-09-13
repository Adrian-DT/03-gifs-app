import { Component } from '@angular/core';
// Alias de path para importación, creado en tsconfig.json
import { environment } from '@environments/environment';
// import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'gifs-side-menu-header',
  imports: [],
  templateUrl: './side-menu-header.component.html',
})
export class SideMenuHeaderComponent {

  envs = environment;

}
