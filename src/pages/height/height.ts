import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-height',
  templateUrl: 'height.html',
})
export class HeightPage {
  
  uid;
  user;
  userKey;
  height: FormGroup;

  constructor(private navCtrl: NavController, private navParams: NavParams, private formBuilder: FormBuilder, private authData: AuthProvider) {
    this.height = formBuilder.group({
      height: '',
      unit: ''
    })

    this.user = navParams.get('user');
    this.userKey = navParams.get('userKey');
    this.uid = navParams.get('uid')

    if(this.user.height){
      this.height.get("height").setValue(this.user.height.height);
      this.height.get("unit").setValue(this.user.phone);
      }
  }

  save(){
    this.authData.updateHeight(this.height.value, this.userKey, this.uid);
      this.navCtrl.pop()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HeightPage');
  }

}
