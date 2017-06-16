import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';


import { SignupPage } from '../../pages/signup/signup';
import { EditUserPage } from '../../pages/edit-user/edit-user';

@Component({
  selector: 'user',
  templateUrl: 'user.html'
})
export class UserComponent {
  user;
  uid;

  constructor(private authData: AuthProvider, public navCtrl: NavController, private navParams: NavParams) {
    this.user = navParams.get('user');
    console.log(this.user)
  }

  signOut() {
    this.authData.logoutUser();
    this.navCtrl.parent.parent.setRoot(SignupPage);
  }

  editUser(){
      this.navCtrl.push(EditUserPage, {
            displayName: this.user.displayName,
            photoURL: this.user.photoURL,
            email: this.user.email
      });
  }


}
