import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Output() public valueChange: EventEmitter<void> = new EventEmitter();
  @Output() public cellFocusEvent = new EventEmitter<Cell>();

  public highlightCell: boolean;
  public highlightValue: boolean;

  constructor(private gameConfig: GameConfigService) { }

  public ngOnInit(): void {
    this.cellHighlightEvent?.subscribe(
      (highlightedCell: Cell) => this.processCellHighlight(highlightedCell)
    );
  }

  public processModelChange(event: KeyboardEvent): void {
    if (event.key >= '1' && event.key <= '9') {
      this.cell.currentValue = event.key;
    } else if (event.key === '' || event.key === 'Delete' || event.key === 'Backspace') {
      this.cell.currentValue = undefined;
    }
    event.preventDefault();
    this.valueChange.emit();
    // Emit focus event to show value css class
    this.cellFocusEvent.emit(this.cell);
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

}
