import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ImageAsParticlesComponent } from './image-as-particles/image-as-particles.component';
import { ImageTransitionComponent } from './image-transition/image-transition.component';
import { LightboxComponent } from './lightbox/lightbox.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'image-as-particles', component: ImageAsParticlesComponent },
  { path: 'image-as-particles/:tab', component: ImageAsParticlesComponent },
  { path: 'image-transition', component: ImageTransitionComponent },
  { path: 'image-transition/:tab', component: ImageTransitionComponent },
  { path: 'lightbox', component: LightboxComponent },
  { path: 'lightbox/:tab', component: LightboxComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
