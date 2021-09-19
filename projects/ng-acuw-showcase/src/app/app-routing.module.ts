import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CarouselDemoComponent } from './carousel/carousel-demo.component';
import { HomeComponent } from './home/home.component';
import { ImageAsParticlesComponent } from './image-as-particles/image-as-particles.component';
import { ImageTransitionComponent } from './image-transition/image-transition.component';
import { LightboxComponent } from './lightbox/lightbox.component';
import { PerformanceMonitorDemoComponent } from './performance-monitor/performance-monitor.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'image-as-particles', component: ImageAsParticlesComponent },
  { path: 'image-as-particles/:tab', component: ImageAsParticlesComponent },
  { path: 'image-transition', component: ImageTransitionComponent },
  { path: 'image-transition/:tab', component: ImageTransitionComponent },
  { path: 'lightbox', component: LightboxComponent },
  { path: 'lightbox/:tab', component: LightboxComponent },
  { path: 'carousel', component: CarouselDemoComponent },
  { path: 'carousel/:tab', component: CarouselDemoComponent },
  { path: 'performanceMonitor', component: PerformanceMonitorDemoComponent },
  { path: 'performanceMonitor/:tab', component: PerformanceMonitorDemoComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
