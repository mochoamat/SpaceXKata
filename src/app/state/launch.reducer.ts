import { createReducer, on } from '@ngrx/store';
import * as LaunchActions from './launch.actions';
import { LaunchDto } from '../models/launch.dto';

export interface LaunchState {
  launches: LaunchDto[];
  selectedLaunch: LaunchDto | null;
  favoriteIds: number[];
  loading: boolean;
  error: string | null;
}

export const initialState: LaunchState = {
  launches: [],
  selectedLaunch: null,
  favoriteIds: [],
  loading: false,
  error: null
};

export const launchReducer = createReducer(
  initialState,
  on(LaunchActions.loadLaunches, state => ({ ...state, loading: true, error: null })),
  on(LaunchActions.loadLaunchesSuccess, (state, { launches }) => ({ ...state, loading: false, launches, error: null })),
  on(LaunchActions.loadLaunchesFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(LaunchActions.loadLaunch, state => ({ ...state, loading: true, error: null })),
  on(LaunchActions.loadLaunchSuccess, (state, { launch }) => ({ ...state, loading: false, selectedLaunch: launch, error: null })),
  on(LaunchActions.loadLaunchFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(LaunchActions.addFavorite, (state, { flight_number }) => ({
    ...state,
    favoriteIds: [...state.favoriteIds, flight_number]
  })),
  on(LaunchActions.removeFavorite, (state, { flight_number }) => ({
    ...state,
    favoriteIds: state.favoriteIds.filter(id => id !== flight_number)
  }))
);