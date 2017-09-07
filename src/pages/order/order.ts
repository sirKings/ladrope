import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { CompletedComponent } from '../../components/completed/completed';


@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

user;
order;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
  	this.order = navParams.get('order');
    this.user = navParams.get('user');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

  completeOrder(order){
  	let completeModal = this.modalCtrl.create(CompletedComponent, {
  		order: order,
      user: this.user
  	})
  	completeModal.present()
  }

}
