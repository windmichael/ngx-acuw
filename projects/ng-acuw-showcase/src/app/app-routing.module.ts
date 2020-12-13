import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartjsTestComponent } from './chartjs-test/chartjs-test.component';
import { ImageAsParticlesComponent } from './image-as-particles/image-as-particles.component';
import { ImageTransitionComponent } from './image-transition/image-transition.component';

const routes: Routes = [
  { path: 'image-as-particles', component: ImageAsParticlesComponent },
  { path: 'chartjs-test', component: ChartjsTestComponent },
  { path: 'image-transition', component: ImageTransitionComponent },
  { path: '', redirectTo: 'image-as-particles', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
