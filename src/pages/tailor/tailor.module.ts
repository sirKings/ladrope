import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TailorPage } from './tailor';

import { Ionic2RatingModule } from 'ionic2-rating';
import { TooltipsModule } from 'ionic-tooltips';

@NgModule({
  declarations: [
    TailorPage,
  ],
  imports: [
    IonicPageModule.forChild(TailorPage),
    Ionic2RatingModule,
    TooltipsModule
  ],
  exports: [
    TailorPage
  ]
})
export class TailorPageModule {}
