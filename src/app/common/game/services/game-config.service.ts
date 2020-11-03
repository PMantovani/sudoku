import { Injectable } from '@angular/core';
import { GameDifficulty } from '../game-difficulty';

@Injectable({
  providedIn: 'root'
})
export class GameConfigService {
  public static readonly DEFAULT_BOARD_SIZE = 9;

  private configuredGameDifficulty = GameDifficulty.EASY;
  public highlightBlock = true;
  public highlightValue = true;

  constructor() { }

  public getBoardSize(): number {
    return GameConfigService.DEFAULT_BOARD_SIZE;
  }

  public getGameDifficulty(): GameDifficulty {
    return this.configuredGameDifficulty;
  }

  public setGameDifficulty(difficulty: GameDifficulty): void {
    this.configuredGameDifficulty = difficulty;
  }
}
