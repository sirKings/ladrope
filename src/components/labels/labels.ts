import { Component } from '@angular/core';

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

  text: string;

  constructor() {
    console.log('Hello LabelsComponent Component');
    this.text = 'Hello World';
  }

}
