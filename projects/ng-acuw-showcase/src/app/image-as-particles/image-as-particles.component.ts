import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-as-particles',
  templateUrl: './image-as-particles.component.html',
  styleUrls: ['./image-as-particles.component.css']
})
export class ImageAsParticlesComponent implements OnInit {

  imageUrls: string[] = [
    'assets/dog.png', 
    'assets/pexels-photo.png', 
    'assets/tiger.png', 
    'assets/blue-parakeet-sits-on-eggs.png'];
  selectedUrl: string = '';
  backgroundColor: string = '#222222';

  constructor() { }

  ngOnInit() {
    this.selectedUrl = this.imageUrls[0];
  }

  selectImage(selectedImageUrl: string) {
    this.selectedUrl = selectedImageUrl;
  }
}
