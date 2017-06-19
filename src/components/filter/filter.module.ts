import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FilterComponent } from './filter';

@NgModule({
  declarations: [
    FilterComponent,
  ],
  imports: [
    IonicPageModule.forChild(FilterComponent),
  ],
  exports: [
    FilterComponent
  ]
})
export class FilterComponentModule {}
