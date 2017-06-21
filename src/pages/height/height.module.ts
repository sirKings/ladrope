import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HeightPage } from './height';

@NgModule({
  declarations: [
    HeightPage,
  ],
  imports: [
    IonicPageModule.forChild(HeightPage),
  ],
  exports: [
    HeightPage
  ]
})
export class HeightPageModule {}
