import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HomePage } from '../../pages/home/home'

/**
 * Generated class for the LabelsComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'labels',
  templateUrl: 'labels.html'
})
export class LabelsComponent {

  constructor(private navCtrl: NavController) {
  }

  goHome(){
      this.navCtrl.parent.parent.push(HomePage)
  }
}
