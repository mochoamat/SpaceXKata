import { initialState, launchReducer } from './launch.reducer';
import * as LaunchActions from './launch.actions';
import { createLaunch, createLaunchState } from '../testing/launch.mock';

describe('launchReducer', () => {
  it('should return the initial state for an unknown action', () => {
    const state = launchReducer(undefined, { type: 'unknown' });

    expect(state).toBe(initialState);
  });

  describe('launches list', () => {
    it('loadLaunches should set loading and clear the error', () => {
      const state = launchReducer(createLaunchState({ error: 'boom' }), LaunchActions.loadLaunches());

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('loadLaunchesSuccess should store the launches and stop loading', () => {
      const launches = [createLaunch()];
      const state = launchReducer(createLaunchState({ loading: true }), LaunchActions.loadLaunchesSuccess({ launches }));

      expect(state.launches).toEqual(launches);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('loadLaunchesFailure should store the error and stop loading', () => {
      const state = launchReducer(createLaunchState({ loading: true }), LaunchActions.loadLaunchesFailure({ error: 'boom' }));

      expect(state.loading).toBe(false);
      expect(state.error).toBe('boom');
    });
  });

  describe('launch detail', () => {
    it('loadLaunch should set loading and clear the error', () => {
      const state = launchReducer(createLaunchState({ error: 'boom' }), LaunchActions.loadLaunch({ flight_number: 1 }));

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('loadLaunchSuccess should store the selected launch and stop loading', () => {
      const launch = createLaunch();
      const state = launchReducer(createLaunchState({ loading: true }), LaunchActions.loadLaunchSuccess({ launch }));

      expect(state.selectedLaunch).toEqual(launch);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('loadLaunchFailure should store the error and stop loading', () => {
      const state = launchReducer(createLaunchState({ loading: true }), LaunchActions.loadLaunchFailure({ error: 'Launch not found' }));

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Launch not found');
    });
  });

  describe('favorites', () => {
    it('addFavorite should append the flight number', () => {
      const state = launchReducer(createLaunchState({ favoriteIds: [1] }), LaunchActions.addFavorite({ flight_number: 2 }));

      expect(state.favoriteIds).toEqual([1, 2]);
    });

    it('removeFavorite should remove the flight number', () => {
      const state = launchReducer(createLaunchState({ favoriteIds: [1, 2, 3] }), LaunchActions.removeFavorite({ flight_number: 2 }));

      expect(state.favoriteIds).toEqual([1, 3]);
    });

    it('removeFavorite should leave favorites unchanged when the flight number is absent', () => {
      const state = launchReducer(createLaunchState({ favoriteIds: [1] }), LaunchActions.removeFavorite({ flight_number: 5 }));

      expect(state.favoriteIds).toEqual([1]);
    });
  });
});
