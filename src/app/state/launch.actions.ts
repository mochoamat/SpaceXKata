import { createAction, props } from '@ngrx/store';
import { LaunchDto } from '../models/launch.dto';

export const loadLaunches = createAction('[Launch List] Load Launches');
export const loadLaunchesSuccess = createAction('[Launch List] Load Success', props<{ launches: LaunchDto[] }>());
export const loadLaunchesFailure = createAction('[Launch List] Load Failure', props<{ error: string }>());

export const loadLaunch = createAction('[Launch Detail] Load Launch', props<{ flight_number: number }>());
export const loadLaunchSuccess = createAction('[Launch Detail] Load Success', props<{ launch: LaunchDto }>());
export const loadLaunchFailure = createAction('[Launch Detail] Load Failure', props<{ error: string }>());

export const addFavorite = createAction('[Launch List] Add Favorite', props<{ flight_number: number }>());
export const removeFavorite = createAction('[Launch List] Remove Favorite', props<{ flight_number: number }>());
