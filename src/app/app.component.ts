import { ChangeDetectorRef, Component } from '@angular/core';
import { RateLimitService } from './utils/services/rate-limit/rate-limit.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'eq-challenge';
  rateLimited = false;

  constructor(private rateLimitService: RateLimitService) {}

  ngOnInit() {
    this.rateLimitService.rateLimitEvent.subscribe((data) => {
      if(data.limited) {
        this.rateLimited = true;
      } else {
        this.rateLimited = false;
      }
    })
  }
}
