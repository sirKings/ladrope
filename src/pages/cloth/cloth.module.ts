import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClothPage } from './cloth';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    ClothPage,
  ],
  imports: [
    IonicPageModule.forChild(ClothPage),
    Ionic2RatingModule
  ],
  exports: [
    ClothPage
  ]
})
export class ClothPageModule {}
