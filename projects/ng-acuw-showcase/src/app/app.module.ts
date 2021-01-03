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
import { ImageAsParticlesModule, ImageTransitionModule } from 'projects/ngx-acuw/src/public-api';
import { ImageAsParticlesComponent } from './image-as-particles/image-as-particles.component';
import { ImageTransitionComponent } from './image-transition/image-transition.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    ImageAsParticlesComponent,
    ImageTransitionComponent,
    HomeComponent
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
    ImageTransitionModule
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
