import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { ChartComponent, ChartType } from 'ng-apexcharts';
import { Label, MultiDataSet, Color, BaseChartDirective } from 'ng2-charts';
import { DataService } from 'src/app/utils/services/data/data.service';
import { EventsService } from 'src/app/utils/services/events/events.service';

interface hourlyEvent {
  "date": string,
  "hour": number,
  "events": number
}

interface dailyEvent {
  "date": string,
  "events": number
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  @ViewChild("hourlyEventsChart") chart: ChartComponent | undefined;
  @ViewChild("hourlyEventsDonutChart") donutChart: ChartComponent | undefined;

  constructor(private eventsService: EventsService,
              private dataService: DataService,
              private cdref: ChangeDetectorRef) { 
    
  }

  @Input()
  dataType!: string;

  public hourlyEventsChartOptions: any;
  public hourlyEventsDonutChartOptions: any = {
    series: [
      {
        name: "Events",
        data: []
      }
    ],
    chart: {
      height: 350,
      width: 450,
      type: "radar"
    },
    dataLabels: {
      enabled: true
    },
    plotOptions: {
      radar: {
        size: 140,
        polygons: {
          strokeColor: "#e9e9e9",
          fill: {
            colors: ["#f8f8f8", "#fff"]
          }
        }
      }
    },
    title: {
      text: ""
    },
    colors: ["#FF4560"],
    markers: {
      size: 4,
      colors: ["#fff"],
      strokeColors: ["#FF4560"],
      strokeWidth: 2
    },
    tooltip: {
      y: {
        formatter: function(val: any) {
          return val;
        }
      }
    },
    xaxis: {
      categories: []
    },
    yaxis: {
      tickAmount: 7,
      labels: {
        formatter: function(val: any, i: any) {
          if (i % 2 === 0) {
            return val;
          } else {
            return "";
          }
        }
      }
    }
  };

  public dailyEventsChartOptions: any = {
    series: [
      {
        name: "Events",
        data: []
      }
    ],
    chart: {
      type: "bar",
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: true
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: []
    }
  };

  isLoading = false;
  lstPoint = 0;
  focusedDate: any;
  minDate: any;
  maxDate: any;

  currentDataType: any;


  ngOnInit(): void {
    this.initChart();
  }

  initChart() {
    this.currentDataType = this.dataType || this.dataService.currentChartType || 'eh';
    switch (this.currentDataType) {
      case 'eh' :
        this.initHourlyEventsChart();
        break;
      case 'ed':
        this.initDailyEventsChart();
        break;
    }
  }

  initHourlyEventsChart() {
    let $ = this;
    let options = {
      series: [
        {
          name: "Events",
          data: []
        }
      ],
      legend: {
        show: true,
      },
      chart: {
        id: 'area-datetime',
        type: 'area',
        height: 350,
        zoom: {
          enabled: true,
          type: 'x',  
          autoScaleYaxis: false, 
        },
        toolbar: {
          autoSelected: 'pan' 
        },
        events: {
          markerClick: function(event: any, chartContext: any, config: any) {
            console.log(event, chartContext, config)
            if(config['dataPointIndex'] != -1) {
              let selectedDate = $.hourlyEventsChartOptions['series'][0]['data'][config['dataPointIndex']][0];
              // Default method
              // $.fetchHourlyEventsForDateFromServer(selectedDate);
              // Alternate Method
              $.filterHourlyEventsForDate(selectedDate);
              let d2 = new Date(selectedDate);
              let d3 = new Date(selectedDate);
              d2.setDate(d2.getDate() - 5);
              d3.setDate(d3.getDate() + 5);
              $.hourlyEventsChartOptions['dataLabels'].enabled = true;
              $.chart?.zoomX(d2.getTime(), d3.getTime());
            }
          },
          mouseLeave: function(event: any, chartContext: any, config: any) {
            $.chart?.resetSeries()
          }
        }
      },
      annotations: {
        yaxis: [
          {
            y: 30,
            borderColor: '#999',
            label: {
              show: true,
              text: 'Support',
              style: {
                color: "#fff",
                background: '#00E396'
              }
            }
          }
        ],
        xaxis: [
          {
            x: new Date('01 Jan 2016').getTime(),
            borderColor: '#999',
            yAxisIndex: 0,
            label: {
              datetimeFormatter: {
                year: 'yyyy',
                month: "MMM 'yy",
                day: 'dd MMM',
                hour: 'HH-mm',
            },
              show: true,
              text: 'Rally',
              style: {
                color: "#fff",
                background: '#775DD0'
              }
            }
          }
        ]
      },
      dataLabels: {
        enabled: true
      },
      markers: {
        size: 0,
        style: 'hollow',
      },
      xaxis: {
        type: 'datetime',
        min: new Date('01 Jan 2016').getTime(),
        tickAmount: 6,
        tooltip: {
          formatter: (vals: any, ots: any) => {
            let date = new Date(vals);
            return `${("0" + date.getUTCDate()).substr(-2)}-${("0" + (date.getUTCMonth() + 1)).substr(-2)}-${date.getUTCFullYear()} ${("0" + date.getUTCHours()).substr(-2)}:${("0" + date.getUTCMinutes()).substr(-2)} - ${this.hourlyEventsChartOptions['series'][0]['data'][ots.dataPointIndex][1]} Events`;
          },
        },
        crosshairs: {
          show: true
        }
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy hh mm'
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100]
        }
      },
    }; 
    this.isLoading = true;
    this.eventsService.hourlyEvents().subscribe(
      (res: any) => {
        let chartData: any = [];
        let eventsData: any = {};
        this.minDate = new Date(res[0].date).getTime();
        this.maxDate = new Date(res[0].date).getTime();
        res.forEach((data: hourlyEvent) => {
          
          let date = new Date(data.date);
          date.toLocaleString('en-US', { timeZone: "UTC" })
          date.setUTCHours(0);
          date.setUTCMinutes(0);
          if(!(date.toISOString() in eventsData)) {
            eventsData[date.toISOString()] = [];
          }
          eventsData[date.toISOString()].push({hour: data.hour, events: data.events});
          date.setUTCHours(data.hour);
          let unixTime = date.getTime();
          if(this.minDate > unixTime) 
            this.minDate = unixTime
          if(this.maxDate < unixTime) 
            this.maxDate = unixTime
          chartData.push([unixTime, data.events])
        })
        this.dataService.hourlyEventsMasterData = eventsData;
        options['series'][0]['data'] = chartData;
        options['xaxis']['min'] = this.minDate;
        this.hourlyEventsChartOptions = options;
        this.filterHourlyEventsForDate(this.minDate)
      }, (err: any) => {
        console.log(err)
      }
    )
  }


  // Default method for fetching hourly events for specific date
  // This method fetches data from server whenever user clicks on a datapoint
  // But, due to rate-limitting we will use an alternate method that will filter data from pre-fetched result

  fetchHourlyEventsForDateFromServer(date: any) {
    let dateObj = new Date(date);
    dateObj.setUTCHours(0);
    dateObj.setUTCMinutes(0);
    dateObj.setUTCDate(dateObj.getUTCDate() + 1)
    this.eventsService.hourlyEventsForDate({date: dateObj.toISOString()}).subscribe(
      (res: any) => {
        let seriesData: any = [];
        let categories: any = [];
        res.forEach((data: any) => {
          seriesData.push(data.events);
          dateObj.setUTCHours(data.hour);
          let hourString = ("0" + dateObj.getUTCHours()).substr(-2) + ":00 HRS";
          categories.push(hourString);
        })
        dateObj.setUTCDate(dateObj.getUTCDate() - 1)
        this.hourlyEventsDonutChartOptions['series'][0]['data'] = seriesData;
        this.hourlyEventsDonutChartOptions['xaxis']['categories'] = categories;
        this.hourlyEventsDonutChartOptions['title']['text'] = dateObj.toDateString();
        this.donutChart?.updateOptions(this.hourlyEventsDonutChartOptions);
        this.isLoading = false;
      },(err: any) => {
        console.log(err)
      }
    )
  }

  // Alternate method for fetching hourly events for specific date

  filterHourlyEventsForDate(date: any) {
    let dateObj = new Date(date);
    dateObj.toLocaleString('en-US', { timeZone: "UTC" })
    dateObj.setUTCHours(0);
    dateObj.setUTCMinutes(0);
    let seriesData: any = [];
    let categories: any = [];
    this.dataService.hourlyEventsMasterData[dateObj.toISOString()].forEach((data: any) => {
      seriesData.push(data.events);
      dateObj.setUTCHours(data.hour);
      let hourString = ("0" + dateObj.getUTCHours()).substr(-2) + ":00 HRS";
      categories.push(hourString);
    })
    // console.log(dateObj.getUTCDate())
    dateObj.setUTCDate(dateObj.getUTCDate())
    let utcDateString = dateObj.toUTCString();
    this.hourlyEventsDonutChartOptions['series'][0]['data'] = seriesData;
    this.hourlyEventsDonutChartOptions['xaxis']['categories'] = categories;
    this.hourlyEventsDonutChartOptions['title']['text'] = utcDateString.slice(0, utcDateString.length - 13);
    this.donutChart?.updateOptions(this.hourlyEventsDonutChartOptions);
    this.isLoading = false;
  }

  initDailyEventsChart() {
    this.isLoading = true;
    this.dailyEventsChartOptions['xaxis']['categories'] = [];
    this.dailyEventsChartOptions['series'][0]['data'] = [];
    this.eventsService.dailyEvents().subscribe(
      (res: any) => {
        res.forEach((data: dailyEvent) => {
          let date = new Date(data.date);
          date.setUTCHours(0);
          date.setUTCMinutes(0);
          this.dailyEventsChartOptions['xaxis']['categories'].push(`${("0" + date.getUTCDate()).substr(-2)}-${("0" + (date.getUTCMonth() + 1)).substr(-2)}-${date.getUTCFullYear()}`);
          this.dailyEventsChartOptions['series'][0]['data'].push(data.events)
        })
        this.isLoading = false;
      }, (err: any) => {
        console.log(err)
      }
    )
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.dataType && changes.dataType.currentValue 
        && changes.dataType.currentValue !== changes.dataType.previousValue) {
      this.initChart();
    }
  }
}














  // public polarAreaChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail Sales', 'Telesales', 'Corporate Sales'];
  // public polarAreaChartData: SingleDataSet = [300, 500, 100, 40, 120];
//   public polarAreaLegend = true;
//   public doughnutChartLabels: Label[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
//   public doughnutChartData: MultiDataSet = [
//     [350, 450, 100],
//     [50, 150],
//     [250, 130, 70],
//   ];
//   public doughnutChartType: ChartType = 'doughnut';

//   // public polarAreaChartType: ChartType = 'polarArea';

//   // constructor() { }

//   // ngOnInit(): void {
//   // }

//   // events
//   public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
//     console.log(event, active);
//   }

//   public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
//     // console.log(event, active);
//   }

//   public lineChartData: ChartDataSets[] = [
//     { data: [], label: 'Series A' },
//   ];
//   public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
//   public lineChartOptions: (ChartOptions & { annotation: any }) = {
//     responsive: true,
//     scales: {
//       // We use this empty structure as a placeholder for dynamic theming.
//       xAxes: [{}],
//       yAxes: [
//         {
//           id: 'y-axis-0',
//           position: 'left',
//         },
//         {
//           id: 'y-axis-1',
//           position: 'right',
//           gridLines: {
//             color: 'rgba(255,0,0,0.3)',
//           },
//           ticks: {
//             fontColor: 'red',
//           }
//         }
//       ]
//     },
//     annotation: {
//       annotations: [
//         {
//           type: 'line',
//           mode: 'vertical',
//           scaleID: 'x-axis-0',
//           value: 'March',
//           borderColor: 'orange',
//           borderWidth: 2,
//           label: {
//             enabled: true,
//             fontColor: 'orange',
//             content: 'LineAnno'
//           }
//         },
//       ],
//     },
//   };
//   public lineChartColors: Color[] = [
//     { // grey
//       backgroundColor: 'rgba(148,159,177,0.2)',
//       borderColor: 'rgba(148,159,177,1)',
//       pointBackgroundColor: 'rgba(148,159,177,1)',
//       pointBorderColor: '#fff',
//       pointHoverBackgroundColor: '#fff',
//       pointHoverBorderColor: 'rgba(148,159,177,0.8)'
//     },
//     { // dark grey
//       backgroundColor: 'rgba(77,83,96,0.2)',
//       borderColor: 'rgba(77,83,96,1)',
//       pointBackgroundColor: 'rgba(77,83,96,1)',
//       pointBorderColor: '#fff',
//       pointHoverBackgroundColor: '#fff',
//       pointHoverBorderColor: 'rgba(77,83,96,1)'
//     },
//     { // red
//       backgroundColor: 'rgba(255,0,0,0.3)',
//       borderColor: 'red',
//       pointBackgroundColor: 'rgba(148,159,177,1)',
//       pointBorderColor: '#fff',
//       pointHoverBackgroundColor: '#fff',
//       pointHoverBorderColor: 'rgba(148,159,177,0.8)'
//     }
//   ];
//   public lineChartLegend = true;
//   public lineChartType: ChartType = 'line';
//   public lineChartPlugins = [];

//   @ViewChild('BaseChartDirective', { static: true }) ngchart: BaseChartDirective | undefined;

//   // constructor() { }

//   // ngOnInit(): void {
//   // }

//   public randomize(): void {
//     for (let i = 0; i < this.lineChartData.length; i++) {
//       //@ts-ignore
//       for (let j = 0; j < this.lineChartData[i].data.length; j++) {
//       //@ts-ignore
//         this.lineChartData[i].data[j] = this.generateNumber(i);
//       }
//     }
//     this.ngchart?.update();
//   }

//   private generateNumber(i: number): number {
//     return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
//   }


//   public hideOne(): void {
//     const isHidden = this.ngchart?.isDatasetHidden(1);
//     this.ngchart?.hideDataset(1, !isHidden);
//   }

//   public pushOne(): void {
//     this.lineChartData.forEach((x, i) => {
//       const num = this.generateNumber(i);
//       const data: number[] = x.data as number[];
//       data.push(num);
//     });
//     this.lineChartLabels.push(`Label ${this.lineChartLabels.length}`);
//   }

//   public changeColor(): void {
//     this.lineChartColors[2].borderColor = 'green';
//     this.lineChartColors[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;
//   }

//   public changeLabel(): void {
//     this.lineChartLabels[2] = ['1st Line', '2nd Line'];
//   }
// }
