import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private httpClient: HttpClient) { }

  hourlyStats() {
    let url = `${environment.server}/stats/hourly`;
    return this.httpClient.get(url);
  }

  dailyStats() {
    let url = `${environment.server}/stats/daily`;
    return this.httpClient.get(url);
  }
}
