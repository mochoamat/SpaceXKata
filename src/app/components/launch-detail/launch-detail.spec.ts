import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, ParamMap } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject } from 'rxjs';

import { LaunchDetailComponent } from './launch-detail';
import { addFavorite, loadLaunch, removeFavorite } from '../../state/launch.actions';
import { LaunchState } from '../../state/launch.reducer';
import { createLaunch, createLaunchState } from '../../testing/launch.mock';

describe('LaunchDetailComponent', () => {
  const launch = createLaunch({ flight_number: 5, mission_name: 'Crew-1' });
  let component: LaunchDetailComponent;
  let fixture: ComponentFixture<LaunchDetailComponent>;
  let store: MockStore;
  let paramMap$: BehaviorSubject<ParamMap>;
  let dispatchSpy: ReturnType<typeof vi.spyOn>;

  async function setup(state: Partial<LaunchState> = {}): Promise<void> {
    paramMap$ = new BehaviorSubject(convertToParamMap({ id: '5' }));

    await TestBed.configureTestingModule({
      imports: [LaunchDetailComponent],
      providers: [
        provideMockStore({ initialState: { launch: createLaunchState({ selectedLaunch: launch, ...state }) } }),
        { provide: ActivatedRoute, useValue: { paramMap: paramMap$.asObservable() } },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = vi.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(LaunchDetailComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();
  }

  function favoriteIcon(): HTMLElement {
    return fixture.nativeElement.querySelector('mat-card-header mat-icon') as HTMLElement;
  }

  it('should create', async () => {
    await setup();

    expect(component).toBeTruthy();
  });

  it('should dispatch loadLaunch with the flight number from the route', async () => {
    await setup();

    expect(component.flightNumber()).toBe(5);
    expect(dispatchSpy).toHaveBeenCalledWith(loadLaunch({ flight_number: 5 }));
  });

  it('should load the new launch when the route id changes', async () => {
    await setup();

    paramMap$.next(convertToParamMap({ id: '8' }));

    expect(component.flightNumber()).toBe(8);
    expect(dispatchSpy).toHaveBeenCalledWith(loadLaunch({ flight_number: 8 }));
  });

  it('should render the selected launch', async () => {
    await setup();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('mat-card-title')?.textContent).toContain('Crew-1');
    expect(element.querySelector('mat-card-subtitle')?.textContent).toContain('Flight n°5');
    expect(element.querySelector('mat-chip')?.textContent).toContain('Success');
  });

  it('should not be favorite when the launch is not in the favorites', async () => {
    await setup({ favoriteIds: [1] });

    expect(component.isLaunchFavorite()).toBe(false);
    expect(favoriteIcon().classList).not.toContain('favorited');
  });

  it('should be favorite when the launch is in the favorites', async () => {
    await setup({ favoriteIds: [5] });

    expect(component.isLaunchFavorite()).toBe(true);
    expect(favoriteIcon().classList).toContain('favorited');
  });

  it('should not be favorite when no launch is selected', async () => {
    await setup({ selectedLaunch: null, favoriteIds: [5] });

    expect(component.isLaunchFavorite()).toBe(false);
  });

  it('should dispatch addFavorite when toggling a non favorite launch', async () => {
    await setup({ favoriteIds: [] });

    favoriteIcon().click();

    expect(dispatchSpy).toHaveBeenCalledWith(addFavorite({ flight_number: 5 }));
  });

  it('should dispatch removeFavorite when toggling a favorite launch', async () => {
    await setup({ favoriteIds: [5] });

    favoriteIcon().click();

    expect(dispatchSpy).toHaveBeenCalledWith(removeFavorite({ flight_number: 5 }));
  });

  it('should go back in history when clicking the back arrow', async () => {
    await setup();

    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => undefined);
    const backIcon = fixture.nativeElement.querySelector('mat-icon') as HTMLElement;

    backIcon.click();

    expect(backSpy).toHaveBeenCalled();
  });
});
