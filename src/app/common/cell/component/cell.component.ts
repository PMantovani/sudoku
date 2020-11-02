import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  public highlightCell: boolean;

  constructor() { }

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
  }

  private processCellHighlight(highlightedCell: Cell): void {
    this.highlightCell = this.shouldHighlightCell(highlightedCell);
  }

  private shouldHighlightCell(highlightedCell: Cell): boolean {
    return highlightedCell.colPosition === this.cell.colPosition ||
        highlightedCell.rowPosition === this.cell.rowPosition;
  }

}
