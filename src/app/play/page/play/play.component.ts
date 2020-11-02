import { Component, EventEmitter, OnInit } from '@angular/core';
import { Board } from 'src/app/common/board/board';
import { GameDifficulty } from 'src/app/common/game/game-difficulty';
import { GameService } from 'src/app/common/game/services/game.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

  public dificulties = GameDifficulty;
  public gameInProgress = false;
  public resetClockEvent = new EventEmitter<void>();
  public board: Board;
  public gameSolved = false;
  public gameSolvedEvent = new EventEmitter<void>();

  constructor(
    private gameService: GameService
  ) { }

  public ngOnInit(): void {
  }

  public startNewGame(): void {
    this.gameSolved = false;
    this.board = this.gameService.createGame();
    this.gameInProgress = true;
    this.resetClockEvent.emit();
  }

  public resetGame(): void {
    this.gameSolved = false;
    this.board.cells.forEach(row => row.forEach(cell => cell.currentValue = undefined));
    this.resetClockEvent.emit();
  }

  public solveGame(): void {
    this.gameSolved = true;
    this.gameSolvedEvent.emit();
    this.board.cells.forEach(row => row.forEach(cell => cell.currentValue = cell.solution));
  }

  public checkBoard(): void {
    this.gameSolved = this.isGameSolved();
    if (this.gameSolved) {
      this.gameSolvedEvent.emit();
    }
  }

  public onDifficultyChange(newDifficulty: GameDifficulty): void {
    this.gameService.setGameDifficulty(newDifficulty);
  }

  private isGameSolved(): boolean {
    for (let row = 0; row < this.gameService.getBoardSize(); row++) {
      for (let col = 0; col < this.gameService.getBoardSize(); col++) {
        if (this.board.cells[row][col].currentValue !== this.board.cells[row][col].solution) {
          return false;
        }
      }
    }
    return true;
  }

}