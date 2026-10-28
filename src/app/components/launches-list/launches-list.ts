import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { selectAllLaunches, selectIsLoading } from '../../state/launch.selectors';
import { loadLaunches } from '../../state/launch.actions';
import { Router } from '@angular/router';


@Component({
  selector: 'app-launches-list',
  templateUrl: './launches-list.html',
  styleUrls: ['./launches-list.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatChipsModule, MatButtonModule],
})
export class LaunchesListComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  launches = this.store.selectSignal(selectAllLaunches);
  isloading = this.store.selectSignal(selectIsLoading);

  searchTerm = signal('');
  filteredLaunches = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    return this.launches().filter(launch =>
      launch.mission_name.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.store.dispatch(loadLaunches());
  }

  onLaunchClick(flight_number: number): void {
    this.router.navigate(['/launch', flight_number]);
  }
}
