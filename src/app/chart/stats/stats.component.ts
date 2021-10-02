import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { DataService } from 'src/app/utils/services/data/data.service';
import { StatsService } from 'src/app/utils/services/stats/stats.service';

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

  constructor(private statsService: StatsService) {}

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
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          stops: [0, 100, 100, 100]
        }
      },
      labels: [],
      markers: {
        size: 0
      },
      xaxis: {
        
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#008FFB'
          },
          labels: {
            style: {
              colors: '#008FFB',
            },
            formatter: (val: number, indexData: any) => {
              return Math.ceil(val);
            }
          },
          title: {
            text: "Impressions",
            style: {
              color: '#008FFB',
            }
          },
          tooltip: {
            enabled: true
          }
        },
        {
          seriesName: 'Clicks',
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#00E396'
          },
          labels: {
            style: {
              colors: '#00E396',
            },
            formatter: (val: number, indexData: any) => {
              return Math.ceil(val);
            }
          },
          title: {
            text: "Clicks",
            style: {
              color: '#00E396',
            }
          },
        },
        {
          seriesName: 'Revenue',
          opposite: true,
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#FEB019'
          },
          labels: {
            style: {
              colors: '#FEB019'
            },
            formatter: (val: number, indexData: any) => {
              return val.toFixed(2);
            }
          },
          title: {
            text: "Revenue",
            style: {
              color: '#FEB019',
            }
          }
        },
      ],
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