import { ComponentFixture, ComponentFixtureAutoDetect, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { Board } from 'src/app/common/board/board';
import { GameService } from 'src/app/common/game/services/game.service';

import { PlayComponent } from './play.component';

describe('PlayComponent', () => {
  let component: PlayComponent;
  let fixture: ComponentFixture<PlayComponent>;
  let gameService: jasmine.SpyObj<GameService>;
  let startGameSubject: Subject<Board>;
  let newGameButton: HTMLElement;

  beforeEach(waitForAsync(() => {
    gameService = jasmine.createSpyObj('GameService', ['createGame']);
    startGameSubject = new Subject();
    gameService.createGame.and.returnValue(startGameSubject);

    TestBed.configureTestingModule({
      declarations: [ PlayComponent ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        { provide: GameService, useValue: gameService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayComponent);
    component = fixture.componentInstance;
    const configButtons = fixture.debugElement.queryAll(By.css('.config-entry button'));
    newGameButton = configButtons[configButtons.length - 1].nativeElement;
  });

  it('should show menu button on small screens only', () => {
    // tslint:disable-next-line: no-any
    (window as any).innerWidth = 700;
    expect(fixture.debugElement.query(By.css('.config-entry'))).toBeTruthy();
    fixture.debugElement.query(By.css('.expand-menu-button')).nativeElement.click();
    expect(fixture.debugElement.query(By.css('.config-entry'))).toBeFalsy();
  });

  it(`should show loading message while loading game`, waitForAsync(() => {
    expect(fixture.nativeElement.querySelector('p')).toBeFalsy();
    newGameButton.click();
    expect(fixture.nativeElement.querySelector('p').textContent).toContain('Carregando novo jogo...');
  }));

  it(`should show board after finished loading game`, waitForAsync(() => {
    newGameButton.click();
    startGameSubject.next({ cells: [] });
    startGameSubject.complete();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('p')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('app-board')).toBeTruthy();
  }));
});
