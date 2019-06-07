import { DashboardServiceService } from './dashboard-service.service';
import { Component, OnInit, SimpleChanges } from '@angular/core';
import * as Chartist from 'chartist';
import { HttpClient } from '@angular/common/http';
import { interval } from "rxjs/internal/observable/interval";
import { startWith, switchMap } from "rxjs/operators";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public currentDate;
  constructor(private dashBoardService:DashboardServiceService) { 
    
  }
  public response;
  public humidityList: Array<number> = new Array();
  public tempList: Array<number> = new Array();
  public time: Array<string> = new Array();
  public mapDetails: Map<string, string> =new Map<string, string>();
  startAnimationForLineChart(chart){
      let seq: any, delays: any, durations: any;
      seq = 0;
      delays = 80;
      durations = 500;

      chart.on('draw', function(data) {
        if(data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if(data.type === 'point') {
              seq++;
              data.element.animate({
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'ease'
                }
              });
          }
      });

      seq = 0;
  };
  startAnimationForBarChart(chart){
      let seq2: any, delays2: any, durations2: any;

      seq2 = 0;
      delays2 = 80;
      durations2 = 500;
      chart.on('draw', function(data) {
        if(data.type === 'bar'){
            seq2++;
            data.element.animate({
              opacity: {
                begin: seq2 * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
      });

      seq2 = 0;
  };
  ngOnInit() {
    this.mapDetails.set("2A4DE51","Hyderabad");
    this.mapDetails.set("942A68E","Kolkata");

      interval(5000)
        .pipe(
          startWith(0),
          switchMap(() => this.dashBoardService.getTweets())
        )
        .subscribe(res => {
          debugger;
          this.response = res;
      this.currentDate = new Date();
      this.methodA();
      this.methodB(  this.response);
      }
        )
      /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */


  }

  ngOnChanges(changes: SimpleChanges): void {
    this.methodB(  this.response);
    
   } 

  public methodB(response: any){
    this.humidityList.push(Number(response.humidity.split("%")[0]));
    this.tempList.push(Number(response.temp.split("Â")[0]));
    var d = new Date();
    this.time.push(d.getSeconds() + "s")
    console.log( this.humidityList)
  }

  public methodA(){
    const dataDailySalesChart: any = {
      labels: [this.time],
      series: [
        this.tempList
      ]
  };

 const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
      }),
      low: 0,
      high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
  }

  var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

  this.startAnimationForLineChart(dailySalesChart);


  /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

  const dataCompletedTasksChart: any = {
      labels: [this.time],
      series:[
        this.humidityList
    ]
  };

 const optionsCompletedTasksChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
      }),
      low: 0,
      high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
  }

  var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

  // start animation for the Completed Tasks Chart - Line Chart
  this.startAnimationForLineChart(completedTasksChart);



  /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

  var datawebsiteViewsChart = {
    labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    series: [
      [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

    ]
  };
  var optionswebsiteViewsChart = {
      axisX: {
          showGrid: false
      },
      low: 0,
      high: 1000,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
  };
  var responsiveOptions: any[] = [
    ['screen and (max-width: 640px)', {
      seriesBarDistance: 5,
      axisX: {
        labelInterpolationFnc: function (value) {
          return value[0];
        }
      }
    }]
  ];
  var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

  //start animation for the Emails Subscription Chart
  this.startAnimationForBarChart(websiteViewsChart);
  }

}
