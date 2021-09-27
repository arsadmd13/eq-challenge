import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  // {
  //   path: 'chart/events',
  //   loadChildren: () => import('./events/events.module')
  //     .then(m => m.EventsModule),
  // },
  {
    path: '',
    loadChildren: () => import('./chart/chart.module')
      .then(m => m.ChartModule),
  },
  {
    path: 'chart',
    loadChildren: () => import('./chart/chart.module')
      .then(m => m.ChartModule),
  },
  {
    path: 'table',
    loadChildren: () => import('./table/table.module')
      .then(m => m.TableModule),
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module')
      .then(m => m.MapModule),
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
