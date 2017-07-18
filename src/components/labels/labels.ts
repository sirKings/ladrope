import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { HomePage } from '../../pages/home/home';
import { OrderPage } from '../../pages/order/order';


@Component({
  selector: 'labels',
  templateUrl: 'labels.html'
})
export class LabelsComponent implements OnInit {

uid;
orders;
savedOrders;
isSavedOrders = false;
isOrders = false;

  constructor(private navCtrl: NavController, private db: AngularFireDatabase, private afAuth: AngularFireAuth) {
  	const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
        console.log(user)
        this.uid = user.uid;
        console.log(this.uid)
        authObserver.unsubscribe();
      }
    });
  }

  goHome(){
      this.navCtrl.parent.parent.push(HomePage)
  }


  getOrders(obj){
  	let result = Object.keys(obj).map((e) => {
             return obj[e];
 	})
 	return result
  }

  ngOnInit(){
  	this.db.object('users/' + this.uid)
    	.subscribe( snapshot => {
                        let userDetails = snapshot;
                        if(userDetails.orders){
                        	this.isOrders = true;
                        	this.orders =  this.getOrders(userDetails.orders)
                        	console.log(this.orders)
                        }
                        if(userDetails.savedOrders){
                        	this.isSavedOrders = true;
                        	this.savedOrders = this.getOrders(userDetails.savedOrders)
                        }

           });

  }

  goToOrder(order){
  	this.navCtrl.parent.parent.push(OrderPage, {
  		order: order
  	})
  }

  goToUser(){
  	this.navCtrl.parent.select(3);
  }
}