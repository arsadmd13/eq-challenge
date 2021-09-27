import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartRoutingModule } from './chart-routing.module';
import { ChartComponent } from './chart.component';
import { EventsComponent } from './events/events.component';
import { StatsComponent } from './stats/stats.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartsModule } from 'ng2-charts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerModule } from '../spinner/spinner.module';


@NgModule({
  declarations: [
    ChartComponent,
    EventsComponent,
    StatsComponent
  ],
  imports: [
    CommonModule,
    ChartRoutingModule,
    NgApexchartsModule,
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule
  ]
})
export class ChartModule { }
