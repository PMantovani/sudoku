import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoardComponent } from './component/board.component';
import { CellModule } from '../cell/cell.module';



@NgModule({
  declarations: [BoardComponent],
  imports: [
    CommonModule,
    CellModule
  ],
  exports: [
    BoardComponent
  ]
})
export class BoardModule { }
