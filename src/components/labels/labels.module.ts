import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LabelsComponent } from './labels';

@NgModule({
  declarations: [
    LabelsComponent,
  ],
  imports: [
    IonicPageModule.forChild(LabelsComponent),
  ],
  exports: [
    LabelsComponent
  ]
})
export class LabelsComponentModule {}
