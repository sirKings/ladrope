import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { CompletedComponent } from '../../components/completed/completed';


@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

order;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
  	this.order = navParams.get('order');
  	console.log(this.order)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
  }

  completeOrder(order){
  	let completeModal = this.modalCtrl.create(CompletedComponent, {
  		order: order
  	})
  	completeModal.present()
  }

}
