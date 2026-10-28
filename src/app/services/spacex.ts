import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LaunchDto } from '../models/launch.dto';

@Injectable({
  providedIn: 'root'
})
export class SpacexService {
  private localUrl = 'launches.json';

  constructor(private http: HttpClient) { }

  getPastLaunches(): Observable<LaunchDto[]> {
    return this.http.get<LaunchDto[]>(this.localUrl);
  }

  getLaunchById(id: number): Observable<LaunchDto | undefined> {
    return this.http.get<LaunchDto[]>(this.localUrl).pipe(
      map(launches => launches.find(l => l.flight_number === id))
    );
  }
}
