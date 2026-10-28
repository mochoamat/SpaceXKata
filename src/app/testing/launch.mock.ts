import { LaunchDto } from '../models/launch.dto';
import { initialState, LaunchState } from '../state/launch.reducer';

export function createLaunch(overrides: Partial<LaunchDto> = {}): LaunchDto {
  return {
    flight_number: 1,
    mission_name: 'FalconSat',
    launch_date_local: '2006-03-25T10:30:00+12:00',
    launch_success: true,
    links: {
      mission_patch_small: 'https://images2.imgbox.com/patch_small.png',
    },
    ...overrides,
  } as LaunchDto;
}

export function createLaunchState(overrides: Partial<LaunchState> = {}): LaunchState {
  return { ...initialState, ...overrides };
}
