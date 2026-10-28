import { TestBed } from '@angular/core/testing';
import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';

import { LaunchEffects } from './launch.effects';
import * as LaunchActions from './launch.actions';
import { SpacexService } from '../services/spacex';
import { createLaunch } from '../testing/launch.mock';

describe('LaunchEffects', () => {
  let actions$: Observable<Action>;
  let effects: LaunchEffects;
  let spacexService: { getPastLaunches: ReturnType<typeof vi.fn>; getLaunchById: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    spacexService = {
      getPastLaunches: vi.fn(),
      getLaunchById: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        LaunchEffects,
        provideMockActions(() => actions$),
        { provide: SpacexService, useValue: spacexService },
      ],
    });

    effects = TestBed.inject(LaunchEffects);
  });

  describe('loadLaunches$', () => {
    it('should dispatch loadLaunchesSuccess with the fetched launches', async () => {
      const launches = [createLaunch()];

      actions$ = of(LaunchActions.loadLaunches());
      spacexService.getPastLaunches.mockReturnValue(of(launches));

      expect(await firstValueFrom(effects.loadLaunches$)).toEqual(LaunchActions.loadLaunchesSuccess({ launches }));
    });

    it('should dispatch loadLaunchesFailure when the request fails', async () => {
      actions$ = of(LaunchActions.loadLaunches());
      spacexService.getPastLaunches.mockReturnValue(throwError(() => new Error('Network error')));

      expect(await firstValueFrom(effects.loadLaunches$)).toEqual(LaunchActions.loadLaunchesFailure({ error: 'Network error' }));
    });
  });

  describe('loadLaunch$', () => {
    it('should dispatch loadLaunchSuccess when the launch is found', async () => {
      const launch = createLaunch({ flight_number: 3 });

      actions$ = of(LaunchActions.loadLaunch({ flight_number: 3 }));
      spacexService.getLaunchById.mockReturnValue(of(launch));

      expect(await firstValueFrom(effects.loadLaunch$)).toEqual(LaunchActions.loadLaunchSuccess({ launch }));
      expect(spacexService.getLaunchById).toHaveBeenCalledWith(3);
    });

    it('should dispatch loadLaunchFailure when the launch is not found', async () => {
      actions$ = of(LaunchActions.loadLaunch({ flight_number: 99 }));
      spacexService.getLaunchById.mockReturnValue(of(undefined));

      expect(await firstValueFrom(effects.loadLaunch$)).toEqual(LaunchActions.loadLaunchFailure({ error: 'Launch not found' }));
    });

    it('should dispatch loadLaunchFailure when the request fails', async () => {
      actions$ = of(LaunchActions.loadLaunch({ flight_number: 3 }));
      spacexService.getLaunchById.mockReturnValue(throwError(() => new Error('Network error')));

      expect(await firstValueFrom(effects.loadLaunch$)).toEqual(LaunchActions.loadLaunchFailure({ error: 'Network error' }));
    });
  });
});
