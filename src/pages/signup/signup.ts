import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import { HomePage } from '../home/home';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  
  user: any;

  constructor(public navCtrl: NavController, private afAuth: AngularFireAuth) {
      
  }

  signInWithFacebook() {
    this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(res => this.user = res);
      //console.log(this.user)
     this.navCtrl.push(HomePage, {user: this.user});
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

}
