import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PoiService {

  constructor(private httpClient: HttpClient) { }

  poiData() {
    let url = `${environment.server}/poi`;
    return this.httpClient.get(url);
  }

  poiWithEvents() {
    let url = `${environment.server}/poi-with-events`;
    return this.httpClient.get(url);
  }
}
