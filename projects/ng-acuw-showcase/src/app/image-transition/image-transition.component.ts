import { animate, animation, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-transition',
  templateUrl: './image-transition.component.html',
  styleUrls: ['./image-transition.component.css'],
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
export class ImageTransitionComponent implements OnInit {

  imageUrls: string[] = [
    'assets/image-transition/img4.jpg',
    'assets/image-transition/img2.jpg',
    'assets/image-transition/img3.jpg',
    'assets/image-transition/img1.jpg'
  ];
  settingsOpen: boolean = false;
  selectedImageSize: string = 'cover';
  selectedTransitionDuration: number = 1000;

  constructor() { }

  ngOnInit(): void {
  }

  toggleSettingsDialog() {
    this.settingsOpen = this.settingsOpen == true ? false : true;
  }
}
