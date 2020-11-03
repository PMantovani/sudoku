import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Board } from '../../board/board';
import { Cell } from '../../cell/cell';
import { GameDifficulty } from '../game-difficulty';
import { GameConfigService } from './game-config.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private gameConfig: GameConfigService) { }

  public createGame(): Observable<Board> {
    return new Observable(subscriber => {
      setTimeout(() => {
        subscriber.next(this.buildGame());
        subscriber.complete();
      });
    });
  }

  private buildGame(): Board {
    const board = this.initializeBlankBoard();

    const solutionFound = this.solveGame(board);
    if (solutionFound === 0) {
      // Unsolvable game. Retrying with a different seed...
      return this.buildGame();
    }

    // Set all cells as fixed values
    for (let row = 0; row < this.gameConfig.getBoardSize(); row++) {
      for (let col = 0; col < this.gameConfig.getBoardSize(); col++) {
        board.cells[row][col].fixedValue = board.cells[row][col].currentValue;
      }
    }

    // Remove some values so user can fill them, according to game difficulty
    const wantedBlankCells = this.getNumberOfBlankCellsForDifficulty(this.gameConfig.getGameDifficulty());
    for (let i = 0; i < wantedBlankCells; i++) {
      const rowIndex = this.getRandomNumberInBoardRange();
      const colIndex = this.getRandomNumberInBoardRange();

      if (board.cells[rowIndex][colIndex].currentValue === undefined) {
        i--;
      } else {
        board.cells[rowIndex][colIndex].currentValue = undefined;
        board.cells[rowIndex][colIndex].fixedValue = undefined;
      }
    }

    const solutionsFound = this.solveGame(board, false);
    if (solutionsFound > 1) {
      // Valid sudoku puzzle only has one possible solution. If more than one was found, create another puzzle.
      return this.buildGame();
    }

    return board;
  }

  public solveGame(board: Board, stopOnFirstSolution = true): number {
    let nextRow = 0;
    let nextCol = 0;
    let moveForward = true;
    const cellGuesses = this.initializeCellGuesses();
    let solutionsFound = 0;

    while (nextRow < this.gameConfig.getBoardSize()) {
      if (nextRow === -1) {
        // If row is negative, it means that backtracking went too far and no solution was found.
        return solutionsFound;
      }

      moveForward = this.guessCell(board, nextRow, nextCol, moveForward, cellGuesses);

      if (!stopOnFirstSolution && moveForward && (nextRow === this.gameConfig.getBoardSize() - 1) &&
          (nextCol === this.gameConfig.getBoardSize() - 1)) {
        solutionsFound++;
        this.fillSolutionFields(board);
        moveForward = false;
      }

      if (moveForward) {
        nextRow = (nextCol + 1) === this.gameConfig.getBoardSize() ? (nextRow + 1) : nextRow;
        nextCol = (nextCol + 1) === this.gameConfig.getBoardSize() ? 0 : (nextCol + 1);
      } else {
        nextRow = nextCol === 0 ? (nextRow - 1) : nextRow;
        nextCol = nextCol === 0 ? (this.gameConfig.getBoardSize() - 1) : (nextCol - 1);
      }
    }

    solutionsFound++;
    this.fillSolutionFields(board);

    return solutionsFound;
  }

  private initializeBlankBoard(): Board {
    const board: Board = { cells: [] };
    for (let row = 0; row < this.gameConfig.getBoardSize(); row++) {
      board.cells.push([]);

      for (let col = 0; col < this.gameConfig.getBoardSize(); col++) {
        board.cells[row].push({
          rowPosition: row,
          colPosition: col,
        });
      }
    }

    return board;
  }

  private initializeCellGuesses(): CellGuesses {
    const cellGuesses: CellGuesses = {
      guesses: []
    };

    for (let row = 0; row < this.gameConfig.getBoardSize(); row++) {
      cellGuesses.guesses.push([]);

      for (let col = 0; col < this.gameConfig.getBoardSize(); col++) {
        cellGuesses.guesses[row].push(new Set());
      }
    }

    return cellGuesses;
  }

  private getRandomNumberInBoardRange(): number {
    return Math.floor(Math.random() * this.gameConfig.getBoardSize());
  }

  private getAvailableValuesForCell(board: Board, cell: Cell): string[] {
    const availableValues = this.getAllValuesForGame();

    for (let row = 0; row < this.gameConfig.getBoardSize(); row++) {
      if (row !== cell.rowPosition) {
        availableValues.delete(board.cells[row][cell.colPosition].currentValue);
      }
    }

    for (let col = 0; col < this.gameConfig.getBoardSize(); col++) {
      if (col !== cell.colPosition) {
        availableValues.delete(board.cells[cell.rowPosition][col].currentValue);
      }
    }

    const rowBlock = Math.floor(cell.rowPosition / 3) * 3;
    const colBlock = Math.floor(cell.colPosition / 3) * 3;
    for (let row = rowBlock; row < rowBlock + 3; row++) {
      for (let col = colBlock; col < colBlock + 3; col++) {
        if (row !== cell.rowPosition || col !== cell.colPosition) {
          availableValues.delete(board.cells[row][col].currentValue);
        }
      }
    }

    return [...availableValues];
  }

  private getAllValuesForGame(): Set<string> {
    return new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9']);
  }

  private guessCell(board: Board, row: number, col: number, movingForward: boolean, cellGuesses: CellGuesses): boolean {
    const cell = board.cells[row][col];
    if (cell.fixedValue === undefined) {
      const availableValues = this.getAvailableValuesForCell(board, cell);

      const unguessedValues = availableValues.filter(i => !cellGuesses.guesses[cell.rowPosition][cell.colPosition].has(i));
      const randomIdx = Math.floor(Math.random() * unguessedValues.length);

      cell.currentValue = unguessedValues[randomIdx];

      if (cell.currentValue !== undefined) {
        cellGuesses.guesses[cell.rowPosition][cell.colPosition].add(cell.currentValue);
      } else {
        cellGuesses.guesses[cell.rowPosition][cell.colPosition].clear();
      }
    }

    return !this.shouldBacktrack(cell, movingForward);
  }

  private shouldBacktrack(cell: Cell, wasMovingForward: boolean): boolean {
    // We want to backtrack if we haven't found a feasible guess for the cell. Or if we were already backtracking
    // and this was a fixed value cell.
    return cell.currentValue === undefined || (!wasMovingForward && cell.fixedValue !== undefined);
  }

  private getNumberOfBlankCellsForDifficulty(difficulty: GameDifficulty): number {
    switch (difficulty) {
      case GameDifficulty.EASY:
        return 40;
      case GameDifficulty.MEDIUM:
        return 45;
      case GameDifficulty.HARD:
        return 50;
    }
  }

  private fillSolutionFields(board: Board): void {
    for (let row = 0; row < this.gameConfig.getBoardSize(); row++) {
      for (let col = 0; col < this.gameConfig.getBoardSize(); col++) {
        board.cells[row][col].solution = board.cells[row][col].currentValue;
      }
    }
  }
}

class CellGuesses {
  public guesses: Set<string>[][];
}
