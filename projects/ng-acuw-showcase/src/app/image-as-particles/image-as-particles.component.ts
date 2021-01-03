import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-as-particles',
  templateUrl: './image-as-particles.component.html',
  styleUrls: ['./image-as-particles.component.css'],
  animations: [
    trigger('settingsContainer',[
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
export class ImageAsParticlesComponent implements OnInit {

  settingsOpen: boolean = false;
  imageUrls: string[] = [
    'assets/dog.png', 
    'assets/pexels-photo.png', 
    'assets/tiger.png', 
    'assets/blue-parakeet-sits-on-eggs.png'];
  selectedUrl: string = '';
  backgroundColor: string = '#222222';
  importModule: string = `import { ImageAsParticlesModule } from 'ngx-acuw';

@NgModule({
  declarations: [AppComponent, ...],
  imports: [ImageAsParticlesModule],  
  bootstrap: [AppComponent]
})
export class AppModule {
}`;
  directiveExample: string = `<lib-image-as-particles 
  [imageUrl]="selectedUrl">
</lib-image-as-particles>`;

  constructor() { }

  ngOnInit() {
    this.selectedUrl = this.imageUrls[0];
  }

  selectImage(selectedImageUrl: string) {
    this.selectedUrl = selectedImageUrl;
  }

  toggleSettingsDialog() {
    this.settingsOpen = this.settingsOpen == true ? false : true;
  }
}
