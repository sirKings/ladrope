import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { MeasurementPage } from '../measurement/measurement';
import { SchedulePage } from '../schedule/schedule';
import { SizePage } from '../size/size';



@IonicPage()
@Component({
  selector: 'page-startmeasure',
  templateUrl: 'startmeasure.html',
})
export class StartmeasurePage {
user;
uid;


  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.user = navParams.get('user');
  	this.uid = navParams.get('uid');
  }

  phone(){
  	this.navCtrl.push(MeasurementPage, {
  		user: this.user,
        uid: this.uid,
  	})
  }

  schedule(){
  	this.navCtrl.push(SchedulePage, {
  		user: this.user,
        uid: this.uid,
  	})
  }

  enterSizes(){
  	this.navCtrl.push(SizePage, {
  		user: this.user,
        uid: this.uid,
  	})
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad StartmeasurePage');
  }

}
