import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  private hourlyEventsMasterDataVal: any;

  set hourlyEventsMasterData(data: any) {
    this.hourlyEventsMasterDataVal = data;
  }

  get hourlyEventsMasterData() {
    return this.hourlyEventsMasterDataVal;
  }

  currentChartType = 'eh';
}
