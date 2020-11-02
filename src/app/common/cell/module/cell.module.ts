import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CellComponent } from '../component/cell.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CellComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CellComponent
  ]
})
export class CellModule { }
