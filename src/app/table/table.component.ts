import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { EventsService } from '../utils/services/events/events.service';
import { PoiService } from '../utils/services/poi/poi.service';
import { StatsService } from '../utils/services/stats/stats.service';
import Fuse from 'fuse.js'

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  constructor(private eventsService: EventsService,
              private statsService: StatsService,
              private cd: ChangeDetectorRef,
              private poiService: PoiService) { }

  searchField = new FormControl('');
  minimumCharMatchLength = new FormControl('', Validators.min(1));
  dataType = new FormControl('eh');

  showSearchErr = false;

  tableHeaders: any = ['#'];
  tableData: any = [];
  tableDataObjects: any = [];
  masterStore: any = [];

  isLoading = false;

  fetchingMethod: any = this.eventsService.hourlyEvents();

  getObjectKeys = Object.keys;

  ngOnInit(): void {
    this.searchField.valueChanges.subscribe((updatedVal) => {
      this.fuzzySearch(updatedVal);
    })
    this.dataType.valueChanges.subscribe((updatedVal) => {
      this.updateData(updatedVal);
    })
    this.minimumCharMatchLength.valueChanges.subscribe((updatedVal) => {
      if(updatedVal < 1) {
        this.minimumCharMatchLength.patchValue(1);
      }
      this.fuzzySearch(this.searchField.value);
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
          this.masterStore.push(data);
        })
        this.isLoading = false;
        this.tableDataObjects = this.masterStore;
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

  fuzzySearch(val: string) {
    let tempDataSet = JSON.parse(JSON.stringify(this.masterStore));
    let minimumCharMatchLength = this.minimumCharMatchLength.value
    if(val === "" || val === null || val === undefined) {
      this.tableDataObjects = tempDataSet;
      this.showSearchErr = false;
      return;
    }
    const options: any = {
      isCaseSensitive: false,
      includeMatches: true,
      minMatchCharLength: minimumCharMatchLength && minimumCharMatchLength !== '' ? minimumCharMatchLength : 1,
      shouldSort: false,
      keys: [
        "date",
        "hour",
        "events",
        "name",
        "impression",
        "clicks",
        "revenue",
        "impressions",
        "lat",
        "lon"
      ],
    };
    
    const fuse = new Fuse(tempDataSet, options);
    this.tableDataObjects = fuse.search(val).map((data: any) => {data['item']['refIndex'] = data['refIndex']; data['item']['matches'] = data['matches']; return this.remasterData(data['item'])}) 
    if(this.tableDataObjects.length === 0) {
      this.showSearchErr = true;
      this.tableDataObjects = tempDataSet;
    } else {
      this.showSearchErr = false;
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
    this.searchField.patchValue('');
    this.showSearchErr = false;
    this.tableHeaders = ['#'];
    this.tableData = [];
    this.tableDataObjects = [];
    this.masterStore = [];
  }

  remasterData(data: any) {
    if('matches' in data) {
      data.matches.forEach((matchedData: any) => {
        let splitedText: any = String(data[matchedData.key]).split('');
        matchedData.indices.forEach((indexs: any) => {
          indexs.forEach((index: any) => {
            if(!String(splitedText[index]).includes('<i>')) {
              splitedText[index] = `<i>${splitedText[index]}</i>`;
            }
          })
        })
        data[matchedData.key] = '<span class="highlight">' + splitedText.join('') + '</span>';
      })
    }
    delete data['matches'];
    delete data['refIndex'];
    return data;
  }

}
