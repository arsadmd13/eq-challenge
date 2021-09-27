import { Component, OnInit } from '@angular/core';
import { RateLimitService } from '../utils/services/rate-limit/rate-limit.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {

  rateLimited = false;
  remainingTime = 0;

  constructor(private rateLimitService: RateLimitService) {}

  ngOnInit() {
    this.rateLimitService.rateLimitEvent.subscribe((data: any) => {
      if(data.limited) {
        this.rateLimited = true;
        this.remainingTime = data.time;
      } else {
        this.rateLimited = false;
      }
    })
  }

  handleCooldownPeriodOverEvent(event?: any) {
    this.rateLimitService.setRateLimitData(false, 0);
  }

}
