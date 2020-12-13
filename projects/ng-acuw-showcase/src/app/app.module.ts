import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageAsParticlesModule } from 'projects/ngx-acuw/src/public-api';
import { ImageAsParticlesComponent } from './image-as-particles/image-as-particles.component';
import { ChartjsTestComponent } from './chartjs-test/chartjs-test.component';
import { ImageTransitionComponent } from './image-transition/image-transition.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageAsParticlesComponent,
    ChartjsTestComponent,
    ImageTransitionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSidenavModule,
    ImageAsParticlesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
