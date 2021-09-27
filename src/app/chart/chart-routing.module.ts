import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChartComponent } from './chart.component';
import { EventsComponent } from './events/events.component';
import { StatsComponent } from './stats/stats.component';

const routes: Routes = [
  {
    path: '',
    component: ChartComponent,
    children: [
      {
        path: 'events',
        component: EventsComponent
      },
      {
        path: 'stats',
        component: StatsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChartRoutingModule { }
