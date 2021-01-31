import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.css']
})
export class LightboxComponent implements OnInit {

  selectedTabIndex = 0;
  imageUrls: string[] = [
    'assets/image-transition/img1.jpg',
    'assets/image-transition/img2.jpg',
    'assets/image-transition/img3.jpg',
    'assets/image-transition/img4.jpg'
  ];
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

  constructor(private route: ActivatedRoute, 
    private router: Router, private utility: UtilityService) { }

  ngOnInit(): void {
    const activeTab = this.route.snapshot.paramMap.get('tab');
    this.selectedTabIndex = this.utility.getTabIndexFromParam(activeTab);
  }

  selctedTabChanged(index: number){
    const param = this.utility.getParamFromTabIndex(index);
    const activeTab = this.route.snapshot.paramMap.get('tab');
    if(activeTab === null){
      this.router.navigate([param], {relativeTo: this.route});
    }else{
      this.router.navigate(['../' + param], {relativeTo: this.route});
    }
  }
}
