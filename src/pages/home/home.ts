import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';


import { UserComponent } from '../../components/user/user';
import { HomeComponent } from '../../components/home/home';
import { OrderComponent } from '../../components/order/order';
import { LabelsComponent } from '../../components/labels/labels';
import { SearchComponent } from '../../components/search/search';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

//tabs components variables
userTab;
homeTab;
order;
labels;
search;


constructor(public navCtrl: NavController) {

    this.userTab = UserComponent;
    this.homeTab = HomeComponent;
    this.order = OrderComponent;
    this.labels = LabelsComponent;
    this.search = SearchComponent;

  }
}
