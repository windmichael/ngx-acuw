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
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageAsParticlesComponent } from './image-as-particles/image-as-particles.component';
import { ImageTransitionComponent } from './image-transition/image-transition.component';
import { HomeComponent } from './home/home.component';
import { LightboxComponent } from './lightbox/lightbox.component';
import { CarouselDemoComponent } from './carousel/carousel-demo.component';
import { ImageAsParticlesModule, ImageTransitionModule, LightboxModule, CarouselModule, PerformanceMonitorModule } from 'projects/ngx-acuw/src/public-api';
import { CodeBlockComponent } from './common/code-block/code-block.component';
import { PerformanceMonitorDemoComponent } from './performance-monitor/performance-monitor.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageAsParticlesComponent,
    ImageTransitionComponent,
    HomeComponent,
    LightboxComponent,
    CarouselDemoComponent,
    CodeBlockComponent,
    PerformanceMonitorDemoComponent
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
    MatSelectModule,
    MatSidenavModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatTabsModule,
    MatSliderModule,
    ImageAsParticlesModule,
    ImageTransitionModule,
    LightboxModule,
    CarouselModule,
    PerformanceMonitorModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
