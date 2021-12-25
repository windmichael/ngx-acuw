import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  navItems: NavItem[] = [
    { name: 'Image As Particles', routeLink: 'image-as-particles' },
    { name: 'Image Transition', routeLink: 'image-transition' },
    { name: 'Lightbox', routeLink: 'lightbox' },
    { name: 'Carousel', routeLink: 'carousel' },
    { name: 'Performance Monitor', routeLink: 'performanceMonitor' },
    { name: 'Particles', routeLink: 'particles' }
  ];
  activeRoute = '';

  constructor(private router: Router, private titleService: Title, private metaService: Meta) {

    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd){
        const url = ev.url;
        // Highlit navigation element of active route
        const idx = this.navItems.findIndex(n => url.includes(n.routeLink));
        this.activeRoute = idx !== -1 ? this.navItems[idx].routeLink : '';

        this.updateMetaTags(ev.urlAfterRedirects);
      }
    });
  }

  /**
   * Update meta tags depending on the route
   * @param url url after redirects
   */
  private updateMetaTags(url: string): void {
    if (url.includes('home')) {
      this.titleService.setTitle('ACUW - Library');
      this.metaService.updateTag({
        name: 'description', 
        content: `ACUW is a collection of components for Angular made with the 3D library three.js.`});
      this.metaService.updateTag({
        name: 'keywords', 
        content: `three.js, threejs, angular, WEBGL, library`});
    } else if('image-as-particles') {
      this.titleService.setTitle('ACUW - Image As Particles');
      this.metaService.updateTag({
        name: 'description', 
        content: `Objects in images shown as interactive particles using the three.js library.`});
      this.metaService.updateTag({
        name: 'keywords', 
        content: `three.js, threejs, angular, WEBGL, image as particles, interactive particles, particle effect`});
    } else if('image-transition') {
      this.titleService.setTitle('ACUW - Image Transition');
      this.metaService.updateTag({
        name: 'description', 
        content: `Allows changing between images with amazing effects.`});
      this.metaService.updateTag({
        name: 'keywords', 
        content: `three.js, threejs, angular, WEBGL, image transition, image, glsl, image effects`});
    } else if('lightbox') {
      this.titleService.setTitle('ACUW - Lightbox');
      this.metaService.updateTag({
        name: 'description', 
        content: `The lighbox component uses the image transition component and wraps it into a lightbox gallery.`});
      this.metaService.updateTag({
        name: 'keywords', 
        content: `three.js, threejs, angular, WEBGL, image transition, lightbox, gallery, glsl, image effects`});
    } else if('carousel') {
      this.titleService.setTitle('ACUW - Carousel');
      this.metaService.updateTag({
        name: 'description', 
        content: `Carousel with 3D effects`});
      this.metaService.updateTag({
        name: 'keywords', 
        content: `three.js, threejs, angular, WEBGL, carousel, 3d`});
    } else if('performanceMonitor') {
      this.titleService.setTitle('ACUW - Performance Monitor');
      this.metaService.updateTag({
        name: 'description', 
        content: `The performance monitor component is a small display, which shows the number of rendered frames per second.`});
      this.metaService.updateTag({
        name: 'keywords', 
        content: `three.js, threejs, angular, WEBGL, performance monitor, fps, frames per second`});
    }
  }
}

export interface NavItem {
      name: string;
      routeLink: string;
}
