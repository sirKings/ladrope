import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'filter',
  templateUrl: 'filter.html'
})
export class FilterComponent {

  filterOptions:FormGroup;

  constructor(private viewCtrl: ViewController, private formBuilder: FormBuilder) {
    this.filterOptions = formBuilder.group({
      price: '',
      class: '',
    })
  }

  dismiss() {
    this.viewCtrl.dismiss(this.filterOptions.value)
    console.log(this.filterOptions.value)
  }

  cancel() {
      this.viewCtrl.dismiss()
  }
}
