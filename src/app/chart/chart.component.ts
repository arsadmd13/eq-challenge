import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {

  dataType = new FormControl('eh');

  fromRoute = true;

  currentRoute = this.router.url;

  constructor(private router: Router) {
    router.events.subscribe((event) => {
      if(event instanceof NavigationEnd)  {
        this.currentRoute = event.url;
        if(this.currentRoute === '/chart' || this.currentRoute === '/') {
          this.fromRoute = false;
        }
      }
  });
  }

  ngOnInit(): void {
  }

}
