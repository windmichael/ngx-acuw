import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RxjsTween } from 'projects/ngx-acuw/src/lib/tween/rxjs-tween';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { ImageTransitionDialogComponent } from './image-transition-dialog/image-transition-dialog.component';

@Component({
  selector: 'app-image-transition',
  templateUrl: './image-transition.component.html',
  styleUrls: ['./image-transition.component.css']
})
export class ImageTransitionComponent implements OnInit {

  imageUrls: string[] = [
    'assets/image-transition/img4.jpg',
    'assets/image-transition/img2.jpg',
    'assets/image-transition/img3.jpg',
    'assets/image-transition/img1.jpg'
  ];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  openSettingsDialog() {
    const dialogRef = this.dialog.open(ImageTransitionDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
