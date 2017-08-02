import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClothPage } from './cloth';
import { Ionic2RatingModule } from 'ionic2-rating';
import { TooltipsModule } from 'ionic-tooltips';


@NgModule({
  declarations: [
    ClothPage,
  ],
  imports: [
    IonicPageModule.forChild(ClothPage),
    Ionic2RatingModule,
    TooltipsModule
  ],
  exports: [
    ClothPage
  ]
})
export class ClothPageModule {}
