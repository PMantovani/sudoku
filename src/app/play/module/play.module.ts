import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayRoutingModule } from './play-routing.module';
import { PlayComponent } from '../page/play/play.component';
import { BoardModule } from 'src/app/common/board/module/board.module';
import { ClockComponent } from '../page/play/clock/clock.component';
import { MinuteSecondsPipe } from 'src/app/common/pipes/minute-seconds.pipe';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PlayComponent,
    ClockComponent,
    MinuteSecondsPipe
  ],
  imports: [
    CommonModule,
    PlayRoutingModule,
    BoardModule,
    FormsModule
  ]
})
export class PlayModule { }
