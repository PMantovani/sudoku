import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cell } from '../../cell/cell';
import { GameConfigService } from '../../game/services/game-config.service';
import { Board } from '../board';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input() public board: Board;
  @Output() public cellValueChanged: EventEmitter<void> = new EventEmitter();

  public blockSize: number;
  public gameSolved = false;
  public cellFocusEvent = new EventEmitter<Cell>();

  constructor(
    private gameConfig: GameConfigService
  ) { }

  public ngOnInit(): void {
    this.blockSize = this.gameConfig.getBoardSize() / 3;
  }

  public onCellFocus(cell: Cell): void {
    this.cellFocusEvent.emit(cell);
  }

}
