import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeComponent } from './home';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    IonicPageModule.forChild(HomeComponent),
    Ionic2RatingModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeComponentModule {}
