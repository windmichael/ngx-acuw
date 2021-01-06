import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-transition',
  templateUrl: './image-transition.component.html',
  styleUrls: ['./image-transition.component.css'],
  animations: [
    trigger('settingsContainer', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('300ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        style({transform: 'translateX(0%)'}),
        animate('300ms ease-in', style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class ImageTransitionComponent implements OnInit {

  imageUrls: string[] = [
    'assets/image-transition/img1.jpg',
    'assets/image-transition/img2.jpg',
    'assets/image-transition/img3.jpg',
    'assets/image-transition/img4.jpg'
  ];
  settingsOpen = false;
  selectedTransitionType = 'noise';
  selectedImageSize = 'cover';
  selectedTransitionDuration = 1000;
  selectedToggleTransitionDirection = true;
  selectedAutoPlayEnabled = true;
  selectedAutoPlayInterval = 5000;
  selectedIntensity = 50.0;
  selectedSizeX = 40.0;
  selectedSizeY = 40.0;
  selectedWidth = 0.5;
  importModule = `import { ImageTransitionModule } from 'ngx-acuw';

@NgModule({
  declarations: [AppComponent, ...],
  imports: [ImageTransitionModule],
  bootstrap: [AppComponent]
})
export class AppModule {
}`;
  directiveExample = `<lib-image-transition
    [imageUrls]="imageUrls"
    transitionType="split"
    imageSize="cover"
    [transitionDuration]="1000">
  </lib-image-transition>`;

  constructor() { }

  ngOnInit(): void {
  }

  toggleSettingsDialog(): void {
    this.settingsOpen = this.settingsOpen === true ? false : true;
  }

  formatLabelNumber(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value.toString();
  }
}
