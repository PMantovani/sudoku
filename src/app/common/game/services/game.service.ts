import { Injectable } from '@angular/core';
import { Board } from '../../board/board';
import { Cell } from '../../cell/cell';
import { GameDifficulty } from '../game-difficulty';
import { SudokuSolverError } from './sudoku-solver-error';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  public static readonly DEFAULT_BOARD_SIZE = 9;

  private configuredGameDifficulty = GameDifficulty.EASY;

  constructor() { }

  public getBoardSize(): number {
    return GameService.DEFAULT_BOARD_SIZE;
  }

  public getGameDifficulty(): GameDifficulty {
    return this.configuredGameDifficulty;
  }

  public setGameDifficulty(difficulty: GameDifficulty): void {
    this.configuredGameDifficulty = difficulty;
  }

  public createGame(): Board {
    const board = this.initializeBlankBoard();

    try {
      const solution = this.solveGame(board);

      // Set all cells as fixed values
      for (let row = 0; row < this.getBoardSize(); row++) {
        for (let col = 0; col < this.getBoardSize(); col++) {
          board.cells[row][col].fixedValue = board.cells[row][col].currentValue;
        }
      }

      // Remove some values so user can fill them, according to game difficulty
      const wantedBlankCells = this.getNumberOfBlankCellsForDifficulty(this.getGameDifficulty());
      for (let i = 0; i < wantedBlankCells; i++) {
        const rowIndex = this.getRandomNumberInBoardRange();
        const colIndex = this.getRandomNumberInBoardRange();

        solution.cells[rowIndex][colIndex].currentValue = undefined;
        solution.cells[rowIndex][colIndex].fixedValue = undefined;
      }
      return solution;

    } catch (e) {
      if (e instanceof SudokuSolverError) {
        // Unsolvable game. Retrying with a different seed...
        return this.createGame();
      }
    }

  }

  public solveGame(board: Board): Board {
    let nextRow = 0;
    let nextCol = 0;
    let moveForward = true;
    const cellGuesses = this.initializeCellGuesses();

    while (nextRow < this.getBoardSize()) {
      moveForward = this.guessCell(board, nextRow, nextCol, moveForward, cellGuesses);
      if (moveForward) {
        nextRow = (nextCol + 1) === this.getBoardSize() ? (nextRow + 1) : nextRow;
        nextCol = (nextCol + 1) === this.getBoardSize() ? 0 : (nextCol + 1);
      } else {
        nextRow = nextCol === 0 ? (nextRow - 1) : nextRow;
        nextCol = nextCol === 0 ? (this.getBoardSize() - 1) : (nextCol - 1);
      }
    }

    for (let row = 0; row < this.getBoardSize(); row++) {
      for (let col = 0; col < this.getBoardSize(); col++) {
        board.cells[row][col].solution = board.cells[row][col].currentValue;
      }
    }

    return board;
  }

  private initializeBlankBoard(): Board {
    const board: Board = { cells: [] };
    for (let row = 0; row < this.getBoardSize(); row++) {
      board.cells.push([]);

      for (let col = 0; col < this.getBoardSize(); col++) {
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

    for (let row = 0; row < this.getBoardSize(); row++) {
      cellGuesses.guesses.push([]);

      for (let col = 0; col < this.getBoardSize(); col++) {
        cellGuesses.guesses[row].push(new Set());
      }
    }

    return cellGuesses;
  }

  private getRandomNumberInBoardRange(): number {
    return Math.floor(Math.random() * this.getBoardSize());
  }

  private getAvailableValuesForCell(board: Board, cell: Cell): string[] {
    const availableValues = this.getAllValuesForGame();

    for (let row = 0; row < this.getBoardSize(); row++) {
      if (row !== cell.rowPosition) {
        availableValues.delete(board.cells[row][cell.colPosition].currentValue);
      }
    }

    for (let col = 0; col < this.getBoardSize(); col++) {
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
    // If row is negative, it means that backtracking went too far and no solution was found.
    if (row === -1) {
      throw new SudokuSolverError();
    }
    const cell = board.cells[row][col];
    if (cell.fixedValue === undefined) {
      const availableValues = this.getAvailableValuesForCell(board, cell);

      const unguessedValues = availableValues.filter(i => !cellGuesses.guesses[cell.rowPosition][cell.colPosition].has(i));
      const randomIdx = Math.floor(Math.random() * unguessedValues.length);

      cell.currentValue = unguessedValues[randomIdx];

      if (cell.currentValue !== undefined) {
        cellGuesses.guesses[cell.rowPosition][cell.colPosition].add(cell.currentValue);
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
        return 50;
      case GameDifficulty.HARD:
        return 60;
    }
  }
}

class CellGuesses {
  public guesses: Set<string>[][];
}
