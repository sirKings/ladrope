import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderComponent } from './order';

@NgModule({
  declarations: [
    OrderComponent,
  ],
  imports: [
    IonicPageModule.forChild(OrderComponent),
  ],
  exports: [
    OrderComponent
  ]
})
export class OrderComponentModule {}
