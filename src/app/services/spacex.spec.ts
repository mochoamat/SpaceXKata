import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { SpacexService } from './spacex';
import { createLaunch } from '../testing/launch.mock';

describe('SpacexService', () => {
  const launches = [
    createLaunch({ flight_number: 1, mission_name: 'FalconSat' }),
    createLaunch({ flight_number: 2, mission_name: 'DemoSat' }),
  ];
  let service: SpacexService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(SpacexService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getPastLaunches should GET all launches from launches.json', () => {
    let result: unknown;

    service.getPastLaunches().subscribe(value => (result = value));

    const req = httpMock.expectOne('launches.json');

    expect(req.request.method).toBe('GET');

    req.flush(launches);

    expect(result).toEqual(launches);
  });

  it('getLaunchById should return the launch matching the flight number', () => {
    let result: unknown;

    service.getLaunchById(2).subscribe(value => (result = value));
    httpMock.expectOne('launches.json').flush(launches);

    expect(result).toEqual(launches[1]);
  });

  it('getLaunchById should return undefined when no launch matches', () => {
    let result: unknown = 'not set';

    service.getLaunchById(99).subscribe(value => (result = value));
    httpMock.expectOne('launches.json').flush(launches);

    expect(result).toBeUndefined();
  });
});
