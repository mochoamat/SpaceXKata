import { Routes } from '@angular/router';
import { LaunchesListComponent } from './components/launches-list/launches-list';
import { LaunchDetailComponent } from './components/launch-detail/launch-detail';

export const routes: Routes = [
      { path: "", component: LaunchesListComponent, pathMatch: "full" },
      { path: "launch/:id", component: LaunchDetailComponent },
];
