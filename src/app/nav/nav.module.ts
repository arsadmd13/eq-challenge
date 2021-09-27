import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav.component';
import { RouterModule } from '@angular/router';
import { CdTimerModule } from 'angular-cd-timer';


@NgModule({
  declarations: [
    NavComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    CdTimerModule
  ],
  exports: [
    NavComponent
  ]
})
export class NavModule { }
