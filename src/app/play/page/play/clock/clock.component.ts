import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit {

  public secondsPast = 0;
  @Input() public resetClockEvent: EventEmitter<void>;
  @Input() public pauseClockEvent: EventEmitter<void>;
  private clockPaused = false;

  constructor() { }

  public ngOnInit(): void {
    this.resetClockEvent
      .pipe(
          startWith(() => {}), // Needed because reset event emitter might be triggered before the clock component is initiated
          tap(() => this.resetClock()),
          switchMap(() => interval(1000))
        )
      .subscribe(() => this.incrementClock());

    this.pauseClockEvent.subscribe(() => this.clockPaused = true);

  }

  private resetClock(): void {
    this.secondsPast = 0;
    this.clockPaused = false;
  }

  private incrementClock(): void {
    if (!this.clockPaused) {
      this.secondsPast++;
    }
  }

}
