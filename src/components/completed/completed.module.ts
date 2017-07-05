import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompletedComponent } from './completed';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    CompletedComponent,
  ],
  imports: [
    IonicPageModule.forChild(CompletedComponent),
    Ionic2RatingModule
  ],
  exports: [
    CompletedComponent
  ]
})
export class CompletedComponentModule {}
