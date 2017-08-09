import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-size',
  templateUrl: 'size.html',
})
export class SizePage {

user;
uid;

sizeForm;

  constructor(public navCtrl: NavController, private alert: AlertController, private db: AngularFireDatabase, private form: FormBuilder, public navParams: NavParams) {
  	this.user = navParams.get('user');
  	this.uid = navParams.get('uid');

  	this.sizeForm = form.group({
  		head: ['', Validators.required],
  		bicep: ['', Validators.required],
  		sleeve: ['', Validators.required],
  		neck: ['', Validators.required],
  		chest: ['', Validators.required],
  		burst: ['', Validators.required],
  		waist: ['', Validators.required],
  		hips: ['', Validators.required],
  		ankle: ['', Validators.required],
  		thigh: ['', Validators.required],
  		belly: ['', Validators.required],
  		shoulder: ['', Validators.required],
  		fullback: ['', Validators.required],
  		trouserLength: ['', Validators.required],
  		wrist: ['', Validators.required],
  		unit: ['', Validators.required]
  	})
  }

  save(){
  	if(this.sizeForm.valid){
  		this.db.object('users/'+this.uid)
  			.update({size: this.sizeForm.value})
  	}else{
  		let alert = this.alert.create({
              message: 'Enter All details',
              buttons: [
                {
                  text: "Ok",
                  role: 'cancel'
                }
              ]
            });
          alert.present();
  	}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SizePage');
  }

}
