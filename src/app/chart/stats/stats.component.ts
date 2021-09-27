import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartComponent } from 'ng-apexcharts';
import { DataService } from 'src/app/utils/services/data/data.service';
import { EventsService } from 'src/app/utils/services/events/events.service';
import { StatsService } from 'src/app/utils/services/stats/stats.service';

interface hourlyStats {
  "date": string,
  "hour": number,
  "impressions": number,
  "clicks": number,
  "revenue": string
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  @ViewChild("hourlyEventsChart") chart: ChartComponent | undefined;
  @ViewChild("hourlyEventsDonutChart") donutChart: ChartComponent | undefined;

  @Input()
  dataType!: string;

  constructor(private statsService: StatsService,
              private dataService: DataService,
              private cdref: ChangeDetectorRef) { 
    
  }

  public dailyStatsChartOptions: any;

  isLoading = false;
  lstPoint = 0;
  focusedDate: any;
  minDate: any;
  maxDate: any;

  minNoOfRecords = 5;


  ngOnInit(): void {
    let $ = this;
    let options: any = {
      series: [
        {
          name: "Impressions",
          type: "column",
          data: []
        },
        {
          name: "Clicks",
          type: "area",
          data: []
        },
        {
          name: "Revenue",
          type: "area",
          data: []
        }
      ],
      chart: {
        height: 550,
        type: "line",
        stacked: false
      },
      stroke: {
        width: [0, 5, 5],
        curve: "smooth"
      },
      plotOptions: {
        bar: {
          columnWidth: "70%"
        }
      },
      fill: {
        // opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          stops: [0, 100, 100, 100]
        }
      },
      labels: [
        // "01/01/2003",
        // "02/01/2003",
        // "03/01/2003",
        // "04/01/2003",
        // "05/01/2003",
        // "06/01/2003",
        // "07/01/2003",
        // "08/01/2003",
        // "09/01/2003",
        // "10/01/2003",
        // "11/01/2003"
      ],
      markers: {
        size: 0
      },
      xaxis: {
        
      },
      yaxis: {
        min: 0,
        labels: {
          formatter: (val: number, indexData: any) => {
            // console.log(index)
            // console.log(typeof(indexData))
            if(indexData && typeof(indexData) === 'object' && ('seriesIndex' in indexData) && indexData.seriesIndex === 2) {
              return val.toFixed(2);
            }
            return Math.ceil(val);
          }
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
      }
    };
    this.isLoading = true;
    this.statsService.dailyStats().subscribe(
      (res: any) => {
        res.forEach((data: any) => {
          let date = new Date(data.date);
          date.toLocaleString('en-US', { timeZone: "UTC" })
          date.setUTCHours(0);
          date.setUTCMinutes(0);
          options['series'][0]['data'].push(data.impressions)
          options['series'][1]['data'].push(data.clicks)
          options['series'][2]['data'].push(data.revenue)
          options['labels'].push(`${("0" + date.getUTCDate()).substr(-2)}-${("0" + (date.getUTCMonth() + 1)).substr(-2)}-${date.getUTCFullYear()}`)
        })
        this.dailyStatsChartOptions = options;
        this.isLoading = false;
      }, (err: any) => {
        console.log(err)
      }
    )
  }

}
