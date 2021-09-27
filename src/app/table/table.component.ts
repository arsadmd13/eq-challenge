import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EventsService } from '../utils/services/events/events.service';
import { PoiService } from '../utils/services/poi/poi.service';
import { StatsService } from '../utils/services/stats/stats.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  constructor(private eventsService: EventsService,
              private statsService: StatsService,
              private poiService: PoiService) { }

  searchField = new FormControl('');
  dataType = new FormControl('eh');

  showSearchErr = false;

  tableHeaders: any = ['#'];
  tableData: any = [];

  isLoading = false;

  fetchingMethod: any = this.eventsService.hourlyEvents();

  ngOnInit(): void {
    this.searchField.valueChanges.subscribe((updatedVal) => {
      this.searchData(updatedVal)
    })
    this.dataType.valueChanges.subscribe((updatedVal) => {
      this.updateData(updatedVal);
    })
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.fetchingMethod.subscribe(
      (res: any) => {
        this.resetTable();
        for(let key in res[0]) {
          this.tableHeaders.push(key.toUpperCase());
        }
        res.forEach((data: any, i: number) => {
          let tempData = [i + 1];
          for(let key in data) {
            tempData.push(data[key]);
          }
          this.tableData.push(tempData);
        })
        this.isLoading = false;
      }, (err: any) => {
        console.log(err);
        this.isLoading = false;
      }
    )
  }

  searchData(val: string) {
    if(val === "" || val === null || val === undefined) {
      this.showSearchErr = false;
      return;
    }
    let minimalMatchFound = false;
    this.tableData.forEach((tableDataArray: Array<any>, i: number) => {
      let highlight = false;
      tableDataArray.forEach((data, i) => {
        if(i === 0) return;
        if((data + "").toLocaleLowerCase().includes(val.toLocaleLowerCase())) {
          highlight = true;
          minimalMatchFound = true;
        }
      })
      if(highlight) {
        document.getElementById('data' + i)?.classList.add('highlighter-on');
      } else {
        document.getElementById('data' + i)?.classList.remove('highlighter-on');
      }
    })
    if(!minimalMatchFound)  {
      this.showSearchErr = true;
    }
  }

  updateData(val: string) {
    switch(val) {
      case 'eh' :
        this.fetchingMethod = this.eventsService.hourlyEvents();
        break;
      case 'ed' :
        this.fetchingMethod = this.eventsService.dailyEvents();
        break;
      case 'sh' :
        this.fetchingMethod = this.statsService.hourlyStats();
        break;
      case 'sd' :
        this.fetchingMethod = this.statsService.dailyStats();
        break;
      case 'poi' :
        this.fetchingMethod = this.poiService.poiData();
        break;
    }
    this.fetchData();
  }

  resetTable() {
    this.tableHeaders = ['#'];
    this.tableData = [];
  }

}
