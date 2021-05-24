import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-image-as-particles',
  templateUrl: './image-as-particles.component.html',
  styleUrls: ['./image-as-particles.component.css'],
  animations: [
    trigger('settingsContainer', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class ImageAsParticlesComponent implements OnInit {

  /**
   * Properties
   */
  selectedTabIndex = 0;
  settingsOpen = false;
  imageUrls: string[] = [
    'assets/image-as-particles/dog.png',
    'assets/image-as-particles/pexels-photo.png',
    'assets/image-as-particles/tiger.png',
    'assets/image-as-particles/blue-parakeet-sits-on-eggs.png'];
  selectedUrl = '';
  backgroundColor = '#222222';
  animationEnabled = true;
  code: any;

  /**
   * Constructor
   */
  constructor(private route: ActivatedRoute,
    private router: Router, private utility: UtilityService) {
    this.code = code;
  }

  /**
   * Angular lifecycle -> ngOnInit
   */
  ngOnInit(): void {
    this.selectedUrl = this.imageUrls[0];
    const activeTab = this.route.snapshot.paramMap.get('tab');
    this.selectedTabIndex = this.utility.getTabIndexFromParam(activeTab);
  }

  /**
   * Change the route, when the tab is changed
   * @param index index of the tab
   */
  selctedTabChanged(index: number) {
    const param = this.utility.getParamFromTabIndex(index);
    const activeTab = this.route.snapshot.paramMap.get('tab');
    if (activeTab === null) {
      this.router.navigate([param], { relativeTo: this.route });
    } else {
      this.router.navigate(['../' + param], { relativeTo: this.route });
    }
  }
}

/**
 * constant, which contains code to be shown in a code-block
 */
const code = {
  importModule: `import { ImageAsParticlesModule } from 'ngx-acuw';

@NgModule({
  declarations: [AppComponent, ...],
  imports: [ImageAsParticlesModule],
  bootstrap: [AppComponent]
})
export class AppModule {
}`,
  directiveExample: `<lib-image-as-particles
  [imageUrl]="selectedUrl">
</lib-image-as-particles>`
};