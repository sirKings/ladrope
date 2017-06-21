import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimeModalComponent } from './time-modal';

@NgModule({
  declarations: [
    TimeModalComponent,
  ],
  imports: [
    IonicPageModule.forChild(TimeModalComponent),
  ],
  exports: [
    TimeModalComponent
  ]
})
export class TimeModalComponentModule {}
