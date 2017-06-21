import { Component } from '@angular/core';

import { ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'time-modal',
  templateUrl: 'time-modal.html'
})
export class TimeModalComponent {

  timeValue: FormGroup;

  constructor(private viewCtrl: ViewController, private formBuilder: FormBuilder) {
    this.timeValue = formBuilder.group({
      time: '',
    })
  }

  dismiss() {
    this.viewCtrl.dismiss(this.timeValue.value.time)
  }

}
