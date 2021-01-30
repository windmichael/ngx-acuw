import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  /**
   * returns the tab index depending on the rout url parameter
   * @param param parameter from the route url
   */
  getTabIndexFromParam(param: string | null) {
    switch (param) {
      case 'demo':
        return 0;
      case 'description':
        return 1;
      default:
        return 0;
    }
  }

  /**
   * returns the route url param depending on the tab index
   * @param index tab index
   */
  getParamFromTabIndex(index: number) {
    switch (index) {
      case 0:
        return 'demo';
      case 1:
        return 'description';
      default:
        return 'demo';
    }
  }
}
