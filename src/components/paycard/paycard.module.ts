import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaycardComponent } from './paycard';

@NgModule({
  declarations: [
    PaycardComponent,
  ],
  imports: [
    IonicPageModule.forChild(PaycardComponent),
  ],
  exports: [
    PaycardComponent
  ]
})
export class PaycardComponentModule {}
