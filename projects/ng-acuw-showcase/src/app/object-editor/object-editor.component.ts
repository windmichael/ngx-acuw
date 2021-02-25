import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../services/utility.service';

@Component({
  selector: 'app-object-editor',
  templateUrl: './object-editor.component.html',
  styleUrls: ['./object-editor.component.css']
})
export class ObjectEditorComponent implements OnInit {

  selectedTabIndex = 0;

  constructor(private route: ActivatedRoute, 
    private router: Router, private utility: UtilityService) { }

  ngOnInit(): void {
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
