import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationDirection } from '../../board/navigation-direction';
import { GameConfigService } from '../../game/services/game-config.service';
import { Cell } from '../cell';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {

  @Input() public cell: Cell;
  @Input() public blockSize: number;
  @Input() public cellHighlightEvent: EventEmitter<Cell>;
  @Input() public navigationFocusEvent: EventEmitter<{row: number, col: number}>;
  @Output() public valueChange: EventEmitter<void> = new EventEmitter();
  @Output() public navigationArrowPress: EventEmitter<NavigationDirection> = new EventEmitter();
  @Output() public cellFocusEvent = new EventEmitter<Cell>();

  @ViewChild('cellInput') public cellInput: ElementRef<HTMLInputElement>;

  public highlightCell: boolean;
  public highlightValue: boolean;

  constructor(private gameConfig: GameConfigService) { }

  public ngOnInit(): void {
    this.cellHighlightEvent?.subscribe(
      (highlightedCell: Cell) => this.processCellHighlight(highlightedCell)
    );

    this.navigationFocusEvent?.subscribe(
      (coordinates: {row: number, col: number}) => this.checkNavigationCoordinatesForFocus(coordinates)
    );
  }

  public processModelChange(event: KeyboardEvent): void {
    let relevantKey = true;

    if (event.key >= '1' && event.key <= '9') {
      this.cell.currentValue = event.key;
    } else if (event.key === '' || event.key === 'Delete' || event.key === 'Backspace') {
      this.cell.currentValue = undefined;
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'ArrowRight') {
      this.processNavigationKeyPress(event.key);
    } else {
      relevantKey = false;
    }
    event.preventDefault();

    if (relevantKey) {
      this.valueChange.emit();
      // Emit focus event to show value css class
      this.cellFocusEvent.emit(this.cell);
    }
  }

  public onCellFocus(): void {
    this.cellFocusEvent.emit(this.cell);
  }

  private processCellHighlight(highlightedCell: Cell): void {
    this.highlightCell = this.shouldHighlightCell(highlightedCell);
    this.highlightValue = this.shouldHighlightValue(highlightedCell);
  }

  private shouldHighlightCell(highlightedCell: Cell): boolean {
    const highlightedRowBlock = Math.floor(highlightedCell.rowPosition / 3);
    const highlightedColBlock = Math.floor(highlightedCell.colPosition / 3);
    const cellRowBlock = Math.floor(this.cell.rowPosition / 3);
    const cellColBlock = Math.floor(this.cell.colPosition / 3);

    return this.gameConfig.highlightBlock && (highlightedCell.colPosition === this.cell.colPosition ||
        highlightedCell.rowPosition === this.cell.rowPosition ||
        (highlightedRowBlock === cellRowBlock && highlightedColBlock === cellColBlock));
  }

  private shouldHighlightValue(highlightedCell: Cell): boolean {
    return this.gameConfig.highlightValue &&
        this.cell.currentValue !== undefined && highlightedCell.currentValue === this.cell.currentValue;
  }

  private checkNavigationCoordinatesForFocus(coordinates: {row: number, col: number}): void {
    if (coordinates.row === this.cell.rowPosition && coordinates.col === this.cell.colPosition) {
      // Execute after clearing stack to trigger Angular change detection
      setTimeout(() => this.cellInput.nativeElement.focus());
    }
  }

  private processNavigationKeyPress(key: string): void {
    switch (key) {
      case 'ArrowUp':
        this.navigationArrowPress.emit(NavigationDirection.UP);
        break;
      case 'ArrowRight':
        this.navigationArrowPress.emit(NavigationDirection.RIGHT);
        break;
      case 'ArrowDown':
        this.navigationArrowPress.emit(NavigationDirection.DOWN);
        break;
      case 'ArrowLeft':
        this.navigationArrowPress.emit(NavigationDirection.LEFT);
        break;
    }
  }

}
