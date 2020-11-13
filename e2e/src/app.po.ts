import { browser, by, element, ElementArrayFinder } from 'protractor';

export class AppPage {
  public navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  public clickNewGameButton(): Promise<void> {
    return element(by.css('.config-entry button')).click() as Promise<void>;
  }

  public getNumberOfFixedValueCells(): Promise<number> {
    return element.all(by.css('input.cell.fixed-value')).count() as Promise<number>;
  }

  public selectGameDifficulty(difficulty: string): void {
    element(by.css('select')).click();
    element(by.xpath(`//option[.="${difficulty}"]`)).click();
  }

  public getCellsWithValue(value: string): ElementArrayFinder {
    return element.all(by.css(`input.cell`)).filter(e => e.getAttribute('value').then(curValue => curValue === value));
  }

  public getCellsWithHighlightedValue(value: string): ElementArrayFinder {
    return element.all(by.css(`input.cell.highlight-value`)).filter(e => e.getAttribute('value').then(curValue => curValue === value));
  }

  public clickHighlightCellConfigButton(): void {
    element(by.xpath('//label[.="Iluminar valores"]/..//input')).click();
  }
}
