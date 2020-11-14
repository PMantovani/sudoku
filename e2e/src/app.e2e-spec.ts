import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('Sudoku App', () => {
  let page: AppPage;

  beforeEach(() => {
    browser.waitForAngularEnabled(false);
    page = new AppPage();
  });

  it('should have 41 fixed value cells on medium difficulty game', () => {
    page.navigateTo();
    page.selectGameDifficulty('Fácil');
    page.clickNewGameButton();
    expect(page.getNumberOfFixedValueCells()).toBe(41);
  });

  it('should have 36 fixed value cells on medium difficulty game', () => {
    page.navigateTo();
    page.selectGameDifficulty('Médio');
    page.clickNewGameButton();
    expect(page.getNumberOfFixedValueCells()).toBe(36);
  });

  it('should have 31 fixed value cells on hard difficulty game', () => {
    page.navigateTo();
    page.selectGameDifficulty('Difícil');
    page.clickNewGameButton();
    expect(page.getNumberOfFixedValueCells()).toBe(31);
  });

  it('should highlight all cells of same value when clicking on one of them if highlight config is on', () => {
    page.navigateTo();
    page.selectGameDifficulty('Fácil');
    page.clickNewGameButton();
    page.getCellsWithValue('1').first().click();
    expect(page.getCellsWithHighlightedValue('1').count()).toBe(page.getCellsWithValue('1').count());
  });

  it('should not highlight cells of same value when highlight config is off', () => {
    page.navigateTo();
    page.selectGameDifficulty('Fácil');
    page.clickHighlightValueCellConfigButton();
    page.clickNewGameButton();
    page.getCellsWithValue('1').first().click();
    expect(page.getCellsWithHighlightedValue('1').count()).toBe(0);
  });

  it('should highlight all 21 related cells after clicking in a cell and unhighlight after deselecting option', () => {
    page.navigateTo();
    page.clickNewGameButton();
    expect(page.getRelatedHighlightedCells().count()).toBe(0);
    page.clickOnAnyCell();
    expect(page.getRelatedHighlightedCells().count()).toBe(21);
    page.clickHighlightRelatedCellConfigButton();
    expect(page.getRelatedHighlightedCells().count()).toBe(0);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
