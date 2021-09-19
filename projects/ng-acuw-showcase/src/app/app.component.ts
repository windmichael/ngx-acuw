import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ng-acuw-showcase';
  navItems: NavItem[] = [
    { name: 'Image As Particles', routeLink: 'image-as-particles' },
    { name: 'Image Transition', routeLink: 'image-transition' },
    { name: 'Lightbox', routeLink: 'lightbox' },
    { name: 'Carousel', routeLink: 'carousel' },
    { name: 'Performance Monitor', routeLink: 'performanceMonitor' }
  ];
  activeRoute = '';

  constructor(private router: Router) {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd){
        const url = ev.url;
        // Highlit navigation element of active route
        const idx = this.navItems.findIndex(n => url.includes(n.routeLink));
        this.activeRoute = idx !== -1 ? this.navItems[idx].routeLink : '';
      }
    });
  }
}

export interface NavItem {
      name: string;
      routeLink: string;
}
