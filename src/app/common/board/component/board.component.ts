import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GameService } from '../../game/services/game.service';
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

  constructor(
    private gameService: GameService
  ) { }

  public ngOnInit(): void {
    this.blockSize = this.gameService.getBoardSize() / 3;
  }

}
