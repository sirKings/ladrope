import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TailorPage } from './tailor';

@NgModule({
  declarations: [
    TailorPage,
  ],
  imports: [
    IonicPageModule.forChild(TailorPage),
  ],
  exports: [
    TailorPage
  ]
})
export class TailorPageModule {}
