import { selectAllLaunches, selectFavoriteIds, selectIsLoading, selectLaunch, selectLaunchState } from './launch.selectors';
import { createLaunch, createLaunchState } from '../testing/launch.mock';

describe('launch selectors', () => {
  const launch = createLaunch({ flight_number: 7 });
  const launchState = createLaunchState({
    launches: [launch],
    selectedLaunch: launch,
    favoriteIds: [7],
    loading: true,
  });
  const rootState = { launch: launchState };

  it('selectLaunchState should select the launch feature', () => {
    expect(selectLaunchState(rootState)).toBe(launchState);
  });

  it('selectAllLaunches should select the launches', () => {
    expect(selectAllLaunches(rootState)).toEqual([launch]);
  });

  it('selectIsLoading should select the loading flag', () => {
    expect(selectIsLoading(rootState)).toBe(true);
  });

  it('selectFavoriteIds should select the favorite ids', () => {
    expect(selectFavoriteIds(rootState)).toEqual([7]);
  });

  it('selectLaunch should select the selected launch', () => {
    expect(selectLaunch(rootState)).toBe(launch);
  });
});
