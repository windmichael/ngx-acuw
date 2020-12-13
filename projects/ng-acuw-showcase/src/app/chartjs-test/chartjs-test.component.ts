import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-chartjs-test',
  templateUrl: './chartjs-test.component.html',
  styleUrls: ['./chartjs-test.component.css']
})
export class ChartjsTestComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    
    var canvas: HTMLCanvasElement = document.getElementById('myChart') as HTMLCanvasElement;
    var cdx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
    new Chart(cdx, {
      type: 'bar',
      data: {
        labels: ['2010', '2011', '2012', '2013'],
        datasets: [
          {
            label: 'Costs per Year',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [2000, 2500, 3000, 2100]
          }
        ]
      },
      options: {
        scales: {
          yAxes: [
            { ticks: {
              beginAtZero: true
            }}
          ]
        }
      }
    });
  }

}
