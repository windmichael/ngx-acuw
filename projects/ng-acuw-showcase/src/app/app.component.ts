import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-acuw-showcase';
  navItems: NavItem[] = [
    { name: 'Image As Particles', routeLink: 'image-as-particles' },
    { name: 'Chartjs Test', routeLink: 'chartjs-test' },
    { name: 'Image Transition', routeLink: 'image-transition' }
  ];
}

export interface NavItem{
  name: string;
  routeLink: string;
}