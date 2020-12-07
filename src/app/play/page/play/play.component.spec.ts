import { DebugElement } from '@angular/core';
import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { Board } from 'src/app/common/board/board';
import { GameService } from 'src/app/common/game/services/game.service';
import { PlayComponent } from './play.component';

describe('PlayComponent', () => {
  let component: PlayComponent;
  let fixture: ComponentFixture<PlayComponent>;

  let pageObject: PlayComponentPage;

  beforeEach(waitForAsync(() => {
    pageObject = new PlayComponentPage();

    TestBed.configureTestingModule({
      declarations: [ PlayComponent ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: GameService, useValue: pageObject.gameService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayComponent);
    component = fixture.componentInstance;

    pageObject.setFixture(fixture);
  });

  it('should show menu button on small screens only', () => {
    // tslint:disable-next-line: no-any
    (window as any).innerWidth = 700;
    expect(pageObject.menuConfigEntry).toBeTruthy();
    pageObject.expandMenuButton.click();
    expect(pageObject.menuConfigEntry).toBeFalsy();
  });

  it(`should show loading message while loading game`, waitForAsync(() => {
    expect(pageObject.loadingMsg).toBeFalsy();
    pageObject.newGameButton.click();
    expect(pageObject.loadingMsg.textContent).toContain('Carregando novo jogo...');
  }));

  it(`should show board after finished loading game`, waitForAsync(() => {
    pageObject.newGameButton.click();
    pageObject.finishCreatingGame();
    expect(pageObject.loadingMsg).toBeFalsy();
    expect(pageObject.boardComponent).toBeTruthy();
  }));
});

class PlayComponentPage {
  public gameService: jasmine.SpyObj<GameService>;
  public startGameSubject: Subject<Board>;
  private fixture: ComponentFixture<PlayComponent>;

  public constructor() {
    this.gameService = jasmine.createSpyObj('GameService', ['createGame']);
    this.startGameSubject = new Subject();
    this.gameService.createGame.and.returnValue(this.startGameSubject);
  }

  public setFixture(fixture: ComponentFixture<PlayComponent>): void {
    this.fixture = fixture;
  }

  public get loadingMsg(): HTMLElement {
    return this.fixture.nativeElement.querySelector('p');
  }

  public get menuConfigEntry(): DebugElement {
    return this.fixture.debugElement.query(By.css('.config-entry'));
  }

  public get newGameButton(): HTMLElement {
    const configButtons = this.fixture.debugElement.queryAll(By.css('.config-entry button'));
    return configButtons[configButtons.length - 1].nativeElement;
  }

  public get expandMenuButton(): HTMLElement {
    return this.fixture.debugElement.query(By.css('.expand-menu-button')).nativeElement;
  }

  public get boardComponent(): HTMLElement {
    return this.fixture.nativeElement.querySelector('app-board');
  }

  public finishCreatingGame(): void {
    const board: Board = {
      cells: []
    };

    this.startGameSubject.next(board);
    this.startGameSubject.complete();
    this.fixture.detectChanges();
  }
}
