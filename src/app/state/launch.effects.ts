import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { SpacexService } from '../services/spacex';
import * as LaunchActions from './launch.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';


@Injectable()
export class LaunchEffects {
  private actions$ = inject(Actions);
  private spacexService = inject(SpacexService);

  loadLaunches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LaunchActions.loadLaunches),
      switchMap(() =>
        this.spacexService.getPastLaunches().pipe(
          map(launches => LaunchActions.loadLaunchesSuccess({ launches })),
          catchError(error => of(LaunchActions.loadLaunchesFailure({ error: error.message })))
        )
      )
    )
  );

  loadLaunch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LaunchActions.loadLaunch),
      switchMap(({ flight_number }) =>
        this.spacexService.getLaunchById(flight_number).pipe(
          map(launch => !!launch ? LaunchActions.loadLaunchSuccess({ launch: launch! }) : LaunchActions.loadLaunchFailure({ error: 'Launch not found' })),
          catchError(error => of(LaunchActions.loadLaunchFailure({ error: error.message })))
        )
      )
    )
  );
}
