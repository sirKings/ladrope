import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchComponent } from './search';

@NgModule({
  declarations: [
    SearchComponent,
  ],
  imports: [
    IonicPageModule.forChild(SearchComponent),
  ],
  exports: [
    SearchComponent
  ]
})
export class SearchComponentModule {}
