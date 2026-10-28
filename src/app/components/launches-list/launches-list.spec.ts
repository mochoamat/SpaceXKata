import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { LaunchesListComponent } from './launches-list';
import { loadLaunches } from '../../state/launch.actions';
import { createLaunch, createLaunchState } from '../../testing/launch.mock';

describe('LaunchesListComponent', () => {
  const launches = [
    createLaunch({ flight_number: 1, mission_name: 'FalconSat' }),
    createLaunch({ flight_number: 2, mission_name: 'DemoSat', launch_success: false }),
    createLaunch({ flight_number: 3, mission_name: 'Trailblazer' }),
  ];
  let component: LaunchesListComponent;
  let fixture: ComponentFixture<LaunchesListComponent>;
  let store: MockStore;
  let router: Router;
  let dispatchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaunchesListComponent],
      providers: [
        provideRouter([]),
        provideMockStore({ initialState: { launch: createLaunchState({ launches }) } }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    dispatchSpy = vi.spyOn(store, 'dispatch');
    fixture = TestBed.createComponent(LaunchesListComponent);
    component = fixture.componentInstance;

    await fixture.whenStable();
  });

  function renderedTitles(): string[] {
    const titles = fixture.nativeElement.querySelectorAll('mat-card-title') as NodeListOf<HTMLElement>;

    return Array.from(titles).map(title => title.textContent?.trim() ?? '');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadLaunches on init', () => {
    expect(dispatchSpy).toHaveBeenCalledWith(loadLaunches());
  });

  it('should render a card for every launch', () => {
    expect(renderedTitles()).toEqual(['FalconSat', 'DemoSat', 'Trailblazer']);
  });

  it('should render the success status of each launch', () => {
    const chips = fixture.nativeElement.querySelectorAll('mat-chip') as NodeListOf<HTMLElement>;

    expect(chips[0].textContent).toContain('Success');
    expect(chips[0].classList).toContain('status-success');
    expect(chips[1].textContent).toContain('Failure');
    expect(chips[1].classList).toContain('status-error');
  });

  it('should filter launches by mission name, ignoring case and surrounding spaces', async () => {
    component.searchTerm.set('  SAT ');

    await fixture.whenStable();

    expect(component.filteredLaunches().map(launch => launch.flight_number)).toEqual([1, 2]);
    expect(renderedTitles()).toEqual(['FalconSat', 'DemoSat']);
  });

  it('should render no card when no mission matches', async () => {
    component.searchTerm.set('unknown');

    await fixture.whenStable();

    expect(renderedTitles()).toEqual([]);
  });

  it('should update the list when the store launches change', async () => {
    store.setState({ launch: createLaunchState({ launches: [launches[2]] }) });

    await fixture.whenStable();

    expect(renderedTitles()).toEqual(['Trailblazer']);
  });

  it('should navigate to the launch detail when a card is clicked', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const card = fixture.nativeElement.querySelectorAll('mat-card')[1] as HTMLElement;

    card.click();

    expect(navigateSpy).toHaveBeenCalledWith(['/launch', 2]);
  });
});
