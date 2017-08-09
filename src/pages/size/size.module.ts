import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SizePage } from './size';

@NgModule({
  declarations: [
    SizePage,
  ],
  imports: [
    IonicPageModule.forChild(SizePage),
  ],
  exports: [
    SizePage
  ]
})
export class SizePageModule {}
