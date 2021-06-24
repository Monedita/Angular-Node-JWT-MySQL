import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PostModel } from '../../models';

@Component({
  selector: 'app-card-img',
  templateUrl: './card-img.component.html',
  styleUrls: ['./card-img.component.css']
})
export class CardImgComponent {
  @Input() post!: PostModel; //porque recibe un objeto de la clase importada al principio del arch.
  @Input() user?: string = '';
  @Input() canBeDeleted?: boolean = false;
  @Output() deleted = new EventEmitter<number>();

  constructor() { }

  delete() {
    this.deleted.emit(this.post.id);
  }

}
