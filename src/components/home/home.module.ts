import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeComponent } from './home';
import { Ionic2RatingModule } from 'ionic2-rating';
import { TooltipsModule } from 'ionic-tooltips';
//import { HttpModule } from '@angular/http'; 

@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    IonicPageModule.forChild(HomeComponent),
    Ionic2RatingModule,
    TooltipsModule
    //HttpModule
  ],
  exports: [
    HomeComponent
  ]
})
export class HomeComponentModule {}
