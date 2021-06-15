import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-img',
  templateUrl: './card-img.component.html',
  styleUrls: ['./card-img.component.css']
})
export class CardImgComponent {
  @Input() post!: any; //porque recibe un objeto de la clase importada al principio del arch.
  @Input() user?: string = '';

  constructor() { }

}
