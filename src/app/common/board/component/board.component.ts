import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cell } from '../../cell/cell';
import { GameConfigService } from '../../game/services/game-config.service';
import { Board } from '../board';
import { NavigationDirection } from '../navigation-direction';

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
  public navigationEvent = new EventEmitter<{row: number, col: number}>();

  constructor(
    private gameConfig: GameConfigService
  ) { }

  public ngOnInit(): void {
    this.blockSize = this.gameConfig.getBoardSize() / 3;
  }

  public onCellFocus(cell: Cell): void {
    this.cellFocusEvent.emit(cell);
  }

  public onCellNavigation(cell: Cell, direction: NavigationDirection): void {
    let row = cell.rowPosition;
    let col = cell.colPosition;
    switch (direction) {
      case NavigationDirection.UP:
        row--;
        break;
      case NavigationDirection.RIGHT:
        col++;
        break;
      case NavigationDirection.DOWN:
        row++;
        break;
      case NavigationDirection.LEFT:
        col--;
        break;
    }

    if (row === -1) {
      row = this.gameConfig.getBoardSize() - 1;
    } else if (row === this.gameConfig.getBoardSize()) {
      row = 0;
    }

    if (col === -1) {
      col = this.gameConfig.getBoardSize() - 1;
    } else if (col === this.gameConfig.getBoardSize()) {
      col = 0;
    }

    this.navigationEvent.emit({row, col});
  }

}
