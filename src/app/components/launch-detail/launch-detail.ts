import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Store } from '@ngrx/store';
import { selectFavoriteIds, selectIsLoading, selectLaunch } from '../../state/launch.selectors';
import { addFavorite, loadLaunch, removeFavorite } from '../../state/launch.actions';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-launch-detail',
  templateUrl: './launch-detail.html',
  styleUrls: ['./launch-detail.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatIconModule, MatChipsModule, MatButtonModule],
})
export class LaunchDetailComponent {
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(Store);

  favorites = this.store.selectSignal(selectFavoriteIds);
  launch = this.store.selectSignal(selectLaunch);
  isLoading = this.store.selectSignal(selectIsLoading);

  isLaunchFavorite = computed(() => this.favorites().includes(this.launch()?.flight_number ?? -1));

  flightNumber = toSignal(
    this.activatedRoute.paramMap.pipe(
      map(params => {
        const id = Number(params.get('id'));
        this.store.dispatch(loadLaunch({ flight_number: id }));

        return id;
      }),

    ),
    { initialValue: null }
  );

  goBack(): void {
    window.history.back();
  }

  toggleFavorite(): void {
    if (this.isLaunchFavorite()) {
      this.store.dispatch(removeFavorite({ flight_number: this.flightNumber() ?? -1 }));
    } else {
      this.store.dispatch(addFavorite({ flight_number: this.flightNumber() ?? -1 }));
    }
  }
}
