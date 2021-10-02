import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class EventsService {

  constructor(private httpClient: HttpClient) { }

  hourlyEvents() {
    let url = `${environment.server}/events/hourly`;
    return this.httpClient.get(url);
  }

  hourlyEventsForDate(data: any) {
    let url = `${environment.server}/events/hourly`;
    return this.httpClient.post(url, data);
  }

  dailyEvents() {
    let url = `${environment.server}/events/daily`;
    return this.httpClient.get(url);
  }

  hourlyEventsWithStats() {
    let url = `${environment.server}/events-with-stats/hourly`;
    return this.httpClient.get(url);
  }

  dailyEventsWithStats() {
    let url = `${environment.server}/events-with-stats/daily`;
    return this.httpClient.get(url);
  }
}
