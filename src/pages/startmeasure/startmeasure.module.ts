import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StartmeasurePage } from './startmeasure';

@NgModule({
  declarations: [
    StartmeasurePage,
  ],
  imports: [
    IonicPageModule.forChild(StartmeasurePage),
  ],
  exports: [
    StartmeasurePage
  ]
})
export class StartmeasurePageModule {}
