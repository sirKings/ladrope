import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserComponent } from './user';

@NgModule({
  declarations: [
    UserComponent,
  ],
  imports: [
    IonicPageModule.forChild(UserComponent),
  ],
  exports: [
    UserComponent
  ]
})
export class UserComponentModule {}
