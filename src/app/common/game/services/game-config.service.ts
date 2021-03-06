import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { StorageService } from '../../storage/services/storage.service';
import { GameDifficulty } from '../game-difficulty';

@Injectable({
  providedIn: 'root'
})
export class GameConfigService {
  public static readonly DEFAULT_BOARD_SIZE = 9;
  private readonly DIFFICULTY_STORAGE_KEY = 'difficulty';

  private configuredGameDifficulty: GameDifficulty;
  public highlightBlock = true;
  public highlightValue = true;

  constructor(private storage: StorageService) {
    this.configuredGameDifficulty = this.storage.get<GameDifficulty>(this.DIFFICULTY_STORAGE_KEY) ?? GameDifficulty.EASY;
  }

  public get boardSize(): number {
    return GameConfigService.DEFAULT_BOARD_SIZE;
  }

  public get gameDifficulty(): GameDifficulty {
    return this.configuredGameDifficulty;
  }

  public set gameDifficulty(difficulty: GameDifficulty) {
    this.configuredGameDifficulty = difficulty;
    this.storage.set<GameDifficulty>(this.DIFFICULTY_STORAGE_KEY, this.configuredGameDifficulty);
  }
}
