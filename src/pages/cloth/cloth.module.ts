import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClothPage } from './cloth';

@NgModule({
  declarations: [
    ClothPage,
  ],
  imports: [
    IonicPageModule.forChild(ClothPage),
  ],
  exports: [
    ClothPage
  ]
})
export class ClothPageModule {}
